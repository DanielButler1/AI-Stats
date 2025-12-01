from __future__ import annotations

from typing import Any, Dict, Iterator, Optional, Union
from typing_extensions import NotRequired, TypedDict

from ai_stats_generated import ApiClient, Configuration
from ai_stats_generated.api.completions_api import CompletionsApi
from ai_stats_generated.api.embeddings_api import EmbeddingsApi
from ai_stats_generated.api.images_api import ImagesApi
from ai_stats_generated.api.moderations_api import ModerationsApi
from ai_stats_generated.api.video_api import VideoApi
from ai_stats_generated.models.model_list_response import ModelListResponse
from ai_stats_generated.models.gateway_health_response import GatewayHealthResponse
from ai_stats_generated.models.chat_completions_request import ChatCompletionsRequest
from ai_stats_generated.models.chat_completions_response import ChatCompletionsResponse
from ai_stats_generated.models.chat_completions_request_reasoning_inner import ChatCompletionsRequestReasoningInner
from ai_stats_generated.models.chat_completions_request_tool_choice import ChatCompletionsRequestToolChoice
from ai_stats_generated.models.chat_message import ChatMessage
from ai_stats_generated.models.model_id import ModelId
from ai_stats_generated.models.image_generation_request import ImageGenerationRequest
from ai_stats_generated.models.image_generation_response import ImageGenerationResponse
from ai_stats_generated.models.embeddings_post_request import EmbeddingsPostRequest
from ai_stats_generated.models.moderation_request import ModerationRequest
from ai_stats_generated.models.moderation_response import ModerationResponse
from ai_stats_generated.models.video_generation_request import VideoGenerationRequest
from ai_stats_generated.models.video_generation_response import VideoGenerationResponse

import httpx

DEFAULT_BASE_URL = "https://api.ai-stats.phaseo.app/v1"


class ChatCompletionsParams(TypedDict, total=False):
    reasoning: NotRequired[list[ChatCompletionsRequestReasoningInner]]
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
        self._chat_api = CompletionsApi(api_client=self._client)
        self._embeddings_api = EmbeddingsApi(api_client=self._client)
        self._images_api = ImagesApi(api_client=self._client)
        self._moderations_api = ModerationsApi(api_client=self._client)
        self._video_api = VideoApi(api_client=self._client)

    def generate_text(self, request: ChatCompletionsRequest | ChatCompletionsParams) -> ChatCompletionsResponse:
        payload = request if isinstance(request, ChatCompletionsRequest) else ChatCompletionsRequest.model_validate({**request, "stream": False})
        return self._chat_api.create_chat_completion(chat_completions_request=payload)

    def stream_text(self, request: ChatCompletionsRequest | ChatCompletionsParams) -> Iterator[str]:
        payload = request if isinstance(request, ChatCompletionsRequest) else ChatCompletionsRequest.model_validate({**request, "stream": True})
        client_timeout = self._client.configuration.timeout or None
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

    def generate_image(self, request: ImageGenerationRequest) -> ImageGenerationResponse:
        return self._images_api.images_generations_post(image_generation_request=request)

    def generate_embedding(self, request: EmbeddingsPostRequest):
        return self._embeddings_api.embeddings_post(embeddings_post_request=request)

    def generate_moderation(self, request: ModerationRequest) -> ModerationResponse:
        return self._moderations_api.moderations_post(request)

    def generate_video(self, request: VideoGenerationRequest) -> VideoGenerationResponse:
        return self._video_api.video_generation_post(video_generation_request=request)

    def generate_transcription(self, body: dict[str, Any]) -> Any:
        client_timeout = self._client.configuration.timeout or None
        resp = httpx.post(
            f"{self._base_url}/audio/transcriptions",
            headers={**self._headers, "Content-Type": "application/json"},
            json=body,
            timeout=client_timeout,
        )
        resp.raise_for_status()
        return resp.json()

    def generate_speech(self, body: dict[str, Any]) -> Any:
        client_timeout = self._client.configuration.timeout or None
        resp = httpx.post(
            f"{self._base_url}/audio/speech",
            headers={**self._headers, "Content-Type": "application/json"},
            json=body,
            timeout=client_timeout,
        )
        resp.raise_for_status()
        return resp.json()

    def get_models(self, params: dict[str, Any] | None = None) -> ModelListResponse:
        params = params or {}
        resp = httpx.get(
            f"{self._base_url}/models",
            headers=self._headers,
            params=params,
            timeout=self._client.configuration.timeout or None,
        )
        resp.raise_for_status()
        return ModelListResponse.model_validate(resp.json())

    def get_health(self, params: dict[str, Any] | None = None) -> GatewayHealthResponse:
        params = params or {}
        resp = httpx.get(
            f"{self._base_url}/health",
            headers=self._headers,
            params=params,
            timeout=self._client.configuration.timeout or None,
        )
        resp.raise_for_status()
        return GatewayHealthResponse.model_validate(resp.json())

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
    "EmbeddingsPostRequest",
    "ModerationRequest",
    "ModerationResponse",
    "VideoGenerationRequest",
    "VideoGenerationResponse",
    "ChatMessage",
]
