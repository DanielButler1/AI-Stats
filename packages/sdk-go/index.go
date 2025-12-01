package aistats

// This is a lightweight facade over the generated Go SDK.
// Only the models endpoint is exposed for now.
// Generate the client with: `pnpm openapi:gen:go`
// The generated package name is set to `ai_stats_sdk` in go.codegen.yaml.

import (
	"context"

	gen "packages/sdk-go/gen"
)

type Client struct {
	api *gen.ModelsApiService
}

// New creates a new API client targeting the given base URL with a bearer token.
func New(apiKey string, baseURL string) *Client {
	cfg := gen.NewConfiguration()
	cfg.Servers = gen.ServerConfigurations{{URL: baseURL}}
	cfg.AddDefaultHeader("Authorization", "Bearer "+apiKey)
	apiClient := gen.NewAPIClient(cfg)
	return &Client{api: apiClient.ModelsApi}
}

// GetModels retrieves the model catalogue with optional filters.
func (c *Client) GetModels(ctx context.Context, params *gen.ModelsGetRequest) (gen.ModelListResponse, *gen.APIResponse, error) {
	if params == nil {
		params = &gen.ModelsGetRequest{}
	}
	return c.api.ModelsGet(ctx, params)
}
