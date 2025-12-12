package aistats

// This is a lightweight facade over the generated Go SDK.
// Only the models endpoint is exposed for now.
// Generate the client with: `pnpm openapi:gen:go`
// The generated package name is set to `ai_stats_sdk` in go.codegen.yaml.

import (
	"context"

	gen "packages/sdk-go/gen"
)

// Client provides a thin, typed facade over the generated SDK.
type Client struct {
	Models     *gen.ModelsApiService
	Completions *gen.CompletionsApiService
	Responses  *gen.ResponsesApiService
	Audio      *gen.AudioApiService
	Images     *gen.ImagesApiService
	Moderations *gen.ModerationsApiService
	Video      *gen.VideoApiService
	Batch      *gen.BatchApiService
	Files      *gen.FilesApiService
	Analytics  *gen.AnalyticsApiService
}

// New creates a new API client targeting the given base URL with a bearer token.
func New(apiKey string, baseURL string) *Client {
	cfg := gen.NewConfiguration()
	cfg.Servers = gen.ServerConfigurations{{URL: baseURL}}
	cfg.AddDefaultHeader("Authorization", "Bearer "+apiKey)
	apiClient := gen.NewAPIClient(cfg)
	return &Client{
		Models:      apiClient.ModelsApi,
		Completions: apiClient.CompletionsApi,
		Responses:   apiClient.ResponsesApi,
		Audio:       apiClient.AudioApi,
		Images:      apiClient.ImagesApi,
		Moderations: apiClient.ModerationsApi,
		Video:       apiClient.VideoApi,
		Batch:       apiClient.BatchApi,
		Files:       apiClient.FilesApi,
		Analytics:   apiClient.AnalyticsApi,
	}
}

// GetModels retrieves the model catalogue with optional filters.
func (c *Client) GetModels(ctx context.Context, params *gen.ModelsGetRequest) (gen.ModelListResponse, *gen.APIResponse, error) {
	if params == nil {
		params = &gen.ModelsGetRequest{}
	}
	return c.Models.ModelsGet(ctx, params)
}

// GenerateText calls /chat/completions.
func (c *Client) GenerateText(ctx context.Context, req gen.ChatCompletionsRequest) (gen.ChatCompletionsResponse, *gen.APIResponse, error) {
	return c.Completions.CreateChatCompletion(ctx, gen.CreateChatCompletionRequest{ChatCompletionsRequest: req})
}

// GenerateResponse calls /responses.
func (c *Client) GenerateResponse(ctx context.Context, req gen.ResponsesRequest) (gen.ResponsesResponse, *gen.APIResponse, error) {
	return c.Responses.CreateResponse(ctx, gen.CreateResponseRequest{ResponsesRequest: req})
}

// CreateBatch creates a batch job.
func (c *Client) CreateBatch(ctx context.Context, req gen.BatchRequest) (gen.BatchResponse, *gen.APIResponse, error) {
	return c.Batch.BatchesPost(ctx, gen.BatchesPostRequest{BatchRequest: req})
}

// GetBatch retrieves a batch job by id.
func (c *Client) GetBatch(ctx context.Context, batchID string) (gen.BatchResponse, *gen.APIResponse, error) {
	return c.Batch.BatchesBatchIdGet(ctx, gen.BatchesBatchIdGetRequest{BatchId: batchID})
}
