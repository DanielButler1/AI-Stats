from __future__ import annotations

from typing import Any, Dict, Iterator, Optional, Union
from typing_extensions import NotRequired, TypedDict

from ai_stats_generated import ApiClient, Configuration
from ai_stats_generated.api.default_api import DefaultApi
from ai_stats_generated.models.model_list_response import ModelListResponse
from ai_stats_generated.models.healthz_get200_response import HealthzGet200Response
from ai_stats_generated.models.chat_completions_request import ChatCompletionsRequest
from ai_stats_generated.models.chat_completions_response import ChatCompletionsResponse
from ai_stats_generated.models.chat_completions_request_reasoning import ChatCompletionsRequestReasoning
from ai_stats_generated.models.chat_completions_request_tool_choice import ChatCompletionsRequestToolChoice
from ai_stats_generated.models.chat_message import ChatMessage
from ai_stats_generated.models.model_id import ModelId
from ai_stats_generated.models.image_generation_request import ImageGenerationRequest
from ai_stats_generated.models.image_generation_response import ImageGenerationResponse
from ai_stats_generated.models.moderation_request import ModerationRequest
from ai_stats_generated.models.moderation_response import ModerationResponse
from ai_stats_generated.models.video_generation_request import VideoGenerationRequest
from ai_stats_generated.models.video_generation_response import VideoGenerationResponse
from ai_stats_generated.models.responses_request import ResponsesRequest
from ai_stats_generated.models.responses_response import ResponsesResponse
from ai_stats_generated.models.audio_speech_request import AudioSpeechRequest
from ai_stats_generated.models.audio_transcription_request import AudioTranscriptionRequest
from ai_stats_generated.models.audio_transcription_response import AudioTranscriptionResponse
from ai_stats_generated.models.audio_translation_request import AudioTranslationRequest
from ai_stats_generated.models.batch_request import BatchRequest
from ai_stats_generated.models.batch_response import BatchResponse
from ai_stats_generated.models.file_object import FileObject
from ai_stats_generated.models.file_list_response import FileListResponse

import httpx

DEFAULT_BASE_URL = "https://api.ai-stats.phaseo.app/v1"


class ChatCompletionsParams(TypedDict, total=False):
    reasoning: NotRequired[list[ChatCompletionsRequestReasoning]]
    frequency_penalty: NotRequired[Union[float, int]]
    logit_bias: NotRequired[Dict[str, Union[float, int]]]
    max_output_tokens: NotRequired[int]
    max_completions_tokens: NotRequired[int]
    meta: NotRequired[bool]
    model: ModelId
    messages: list[ChatMessage]
    presence_penalty: NotRequired[Union[float, int]]
    seed: NotRequired[int]
    stream: NotRequired[bool]
    temperature: NotRequired[Union[float, int]]
    tools: NotRequired[list[dict[str, Any]]]
    max_tool_calls: NotRequired[int]
    parallel_tool_calls: NotRequired[bool]
    tool_choice: NotRequired[ChatCompletionsRequestToolChoice]
    top_k: NotRequired[int]
    logprobs: NotRequired[bool]
    top_logprobs: NotRequired[int]
    top_p: NotRequired[Union[float, int]]
    usage: NotRequired[bool]


MODEL_IDS: tuple[ModelId, ...] = tuple(ModelId)


class AIStats:
    def __init__(self, api_key: str, base_url: Optional[str] = None, timeout: Optional[float] = None):
        if not api_key:
            raise ValueError("api_key is required")

        host = (base_url or DEFAULT_BASE_URL).rstrip("/")
        self._base_url = host
        self._headers = {"Authorization": f"Bearer {api_key}"}
        configuration = Configuration(
            host=host,
            api_key={"GatewayAuth": f"Bearer {api_key}"},
        )
        if timeout is not None:
            configuration.timeout = timeout

        self._client = ApiClient(configuration=configuration)
        self._api = DefaultApi(api_client=self._client)

    def generate_text(self, request: ChatCompletionsRequest | ChatCompletionsParams) -> ChatCompletionsResponse:
        payload = request if isinstance(request, ChatCompletionsRequest) else ChatCompletionsRequest.model_validate({**request, "stream": False})
        resp = httpx.post(
            f"{self._base_url}/chat/completions",
            headers={**self._headers, "Content-Type": "application/json"},
            json=payload.model_dump(by_alias=True),
            timeout=self._client.configuration.timeout or None,
        )
        resp.raise_for_status()
        try:
            json_body = resp.json()
        except Exception:
            json_body = {}
        return ChatCompletionsResponse.model_validate(json_body or {})

    def stream_text(self, request: ChatCompletionsRequest | ChatCompletionsParams) -> Iterator[str]:
        payload = request if isinstance(request, ChatCompletionsRequest) else ChatCompletionsRequest.model_validate({**request, "stream": True})
        client_timeout = self._client.configuration.timeout or None
        try:
            with httpx.stream(
                "POST",
                f"{self._base_url}/chat/completions",
                headers={**self._headers, "Content-Type": "application/json"},
                json=payload.model_dump(by_alias=True),
                timeout=client_timeout,
            ) as resp:
                resp.raise_for_status()
                for line in resp.iter_lines():
                    if not line:
                        continue
                    yield line.decode("utf-8") if isinstance(line, (bytes, bytearray)) else str(line)
        except Exception:
            raise

    def generate_image(self, request: ImageGenerationRequest) -> ImageGenerationResponse:
        return self._api.create_image(request)

    def generate_image_edit(self, request: dict[str, Any]) -> ImageGenerationResponse:
        return self._api.create_image_edit(**request)

    def generate_moderation(self, request: ModerationRequest) -> ModerationResponse:
        return self._api.create_moderation(request)

    def generate_video(self, request: VideoGenerationRequest) -> VideoGenerationResponse:
        return self._api.create_video(request)

    def generate_embedding(self, body: dict[str, Any]) -> Any:
        return self._api.create_embedding(body)

    def generate_transcription(self, body: dict[str, Any]) -> Any:
        payload = AudioTranscriptionRequest.model_validate(body)
        return self._api.create_transcription(**payload.model_dump(exclude_none=True))

    def generate_speech(self, body: dict[str, Any]) -> Any:
        payload = AudioSpeechRequest.model_validate(body)
        return self._api.create_speech(payload)

    def generate_translation(self, body: dict[str, Any]) -> AudioTranscriptionResponse:
        payload = AudioTranslationRequest.model_validate(body)
        return self._api.create_translation(**payload.model_dump(exclude_none=True))

    def generate_response(self, request: ResponsesRequest) -> ResponsesResponse:
        payload = request if isinstance(request, ResponsesRequest) else ResponsesRequest.model_validate(request)
        client_timeout = self._client.configuration.timeout or None
        resp = httpx.post(
            f"{self._base_url}/responses",
            headers={**self._headers, "Content-Type": "application/json"},
            json=payload.model_dump(by_alias=True),
            timeout=client_timeout,
        )
        resp.raise_for_status()
        try:
            json_body = resp.json()
        except Exception:
            json_body = {}
        return ResponsesResponse.model_validate(json_body or {})

    def stream_response(self, request: ResponsesRequest) -> Iterator[str]:
        payload = request if isinstance(request, ResponsesRequest) else ResponsesRequest.model_validate({**request, "stream": True})
        client_timeout = self._client.configuration.timeout or None
        try:
            with httpx.stream(
                "POST",
                f"{self._base_url}/responses",
                headers={**self._headers, "Content-Type": "application/json"},
                json=payload.model_dump(by_alias=True),
                timeout=client_timeout,
            ) as resp:
                resp.raise_for_status()
                for line in resp.iter_lines():
                    if not line:
                        continue
                    yield line.decode("utf-8") if isinstance(line, (bytes, bytearray)) else str(line)
        except Exception:
            raise

    def create_batch(self, request: BatchRequest | dict[str, Any]) -> BatchResponse:
        payload = request if isinstance(request, BatchRequest) else BatchRequest.model_validate(request)
        return self._api.create_batch(payload)

    def get_batch(self, batch_id: str) -> BatchResponse:
        return self._api.retrieve_batch(batch_id)

    def list_files(self) -> FileListResponse:
        return self._api.list_files()

    def get_file(self, file_id: str) -> FileObject:
        return self._api.retrieve_file(file_id)

    def upload_file(self, *, purpose: Optional[str] = None, file: Any = None) -> FileObject:
        if file is None:
            raise ValueError("file is required")
        client_timeout = self._client.configuration.timeout or None
        files = {"file": file}
        data = {"purpose": purpose} if purpose else None
        resp = httpx.post(
            f"{self._base_url}/files",
            headers=self._headers,
            files=files,
            data=data,
            timeout=client_timeout,
        )
        resp.raise_for_status()
        return FileObject.model_validate(resp.json())

    def get_models(self, params: dict[str, Any] | None = None) -> ModelListResponse:
        params = params or {}
        return self._api.list_models(**params)

    def get_health(self) -> HealthzGet200Response:
        return self._api.healthz()

    def get_generation(self, generation_id: str) -> Any:
        resp = httpx.get(
            f"{self._base_url}/generations/{generation_id}",
            headers=self._headers,
            timeout=self._client.configuration.timeout or None,
        )
        resp.raise_for_status()
        return resp.json()


__all__ = [
    "AIStats",
    "ChatCompletionsRequest",
    "ChatCompletionsResponse",
    "ChatCompletionsParams",
    "MODEL_IDS",
    "ModelId",
    "ImageGenerationRequest",
    "ImageGenerationResponse",
    "ModerationRequest",
    "ModerationResponse",
    "VideoGenerationRequest",
    "VideoGenerationResponse",
    "ChatMessage",
    "ChatCompletionsRequestReasoning",
    "ResponsesRequest",
    "ResponsesResponse",
    "AudioSpeechRequest",
    "AudioTranscriptionRequest",
    "AudioTranscriptionResponse",
    "AudioTranslationRequest",
    "BatchRequest",
    "BatchResponse",
    "FileObject",
    "FileListResponse",
    "HealthzGet200Response",
]
