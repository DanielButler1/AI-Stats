# 🤝 Contributing to AI Model Stats

Thank you for your interest in contributing to **AI Model Stats**! This is a community-driven project, and we welcome contributions from **everyone**, whether you're a seasoned developer, AI researcher, or simply someone passionate about tracking the evolution of language models.

---

## 🔍 Data Contributions

This section explains how to contribute data to the project. Whether you're adding new models or updating benchmark scores, follow the steps below to ensure consistency and data quality.

---

<details>
<summary>🏢 <strong>Providers</strong> — Add or update AI providers</summary>

#### Creating a New Provider

-   Create a new folder inside `/providers` using the provider’s name in **URL-safe**, **lowercase**, **dash-separated** format (e.g. `openai`, `google`, `mistral-ai`)
-   Inside that folder, create a file named `provider.json`
-   Follow the structure used in existing examples (fields include: `provider_id`, `name`, `website`, etc.)

#### Updating an Existing Provider

-   Locate and edit the `provider.json` file inside the appropriate `/providers/{provider}/` folder
-   Keep all updates clear and accurate
-   Follow the same field naming and structure conventions

</details>

---

<details>
<summary>🤖 <strong>Models</strong> — Add or update individual models</summary>

#### Creating a New Model

-   Create a new folder inside `/models` using the model’s ID in lowercase preferably from an API (e.g. `gpt-4-0314`, `claude-4-opus-20250514`)
-   Inside that folder, add a `model.json` file with fields like:
    -   `name`
    -   `provider_id` (must match an existing entry in `/providers`)
    -   `release_date`
    -   `announcement_link`, `description`, and other relevant info
-   Follow the structure used in other model files
-   Please provide as much detail as possible, ensuring relevant sources are linked appropriately

#### Updating an Existing Model

-   Locate and edit the `model.json` file in `/models/{model-id}/`
-   Add or correct fields like context length, architecture, supported modalities, etc.

</details>

---

<details>
<summary>🧪 <strong>Benchmarks</strong> — Add or update benchmark definitions</summary>

#### Creating a New Benchmark

-   Add a new folder to `/benchmarks` using a short, lowercase, dash-separated name (e.g. `gpqa`, `mmlu`, `arc-agi-1` etc.)
-   Inside that folder, create a `benchmark.json` file
-   Follow the structure used in existing benchmarks.

#### Updating an Existing Benchmark

-   Locate the existing file in `/benchmarks/{benchmark-id}/`
-   Add or correct metadata or improve descriptions

</details>

---

<details>
<summary>📊 <strong>Benchmark Results</strong> — Add results for a model</summary>

#### Adding Benchmark Results

-   Benchmark results live **inside the `model.json` file** of the related model in `/models/{model-id}/`
-   Use the structure:
    ```json
    {
    	"benchmark_id": "mmlu",
    	"score": 86.7,
    	"is_self_reported": true,
    	"source_link": "https://example.com",
    	"other_info": "March 2024 update"
    }
    ```

#### Updating Benchmark Results

-   Locate the `model.json` file for the model you want to update
-   Add or update the `benchmark_results` array with new or corrected entries
-   Ensure all fields are accurate and follow the same structure as existing entries

</details>

---

<details> <summary>🌐 <strong>API Providers</strong> — Add or update model API access sources</summary>

#### Creating a New API Provider

-   Create a new folder inside `/api_providers` using the provider’s name in lowercase, dash-separated format (e.g. `openai`, `google`, `mistral-ai`)
-   Inside that folder, create a file named `provider.json`
-   Include fields like:
    -   `api_provider_id` (must be unique)
    -   `api_provider_name`
    -   `description`
    -   `website` - link to the API homepage

#### Updating an Existing API Provider

-   Locate the `provider.json` file in `/api_providers/{provider}/`
-   Add or correct fields like `api_provider_name`, `description`, `website`, etc.

</details>

---

<details> <summary>💸 <strong>Price Data</strong> — Add or update pricing for model usage</summary>

#### Adding Price Data

-   Find the model you want to add pricing for in `/models/{model-id}/`
-   Inside of the model.json file add a `prices` array with entries like:

    ```json
    {
    	"api_provider": "openai",
    	"input_token_price": 2e-5,
    	"output_token_price": 8e-5,
    	"throughput": "", (optional)
    	"latency": "", (optional)
    	"source_link": null,
    	"other_info": ""
    }
    ```

#### Updating Price Data

-   Locate the `model.json` file for the model's pricing you want to update
-   Add or update the `prices` array with new or corrected entries

</details>

---

---

<details>
<summary>🛠️ <strong>Website Development</strong> — Improve the site with code</summary>

We welcome contributions to the frontend and overall structure of the AI Model Stats website. Whether it’s polishing the UI or improving performance, your help is appreciated!

#### Areas to Contribute

-   Improve UI design or layout
-   Add new pages or functionality
-   Fix existing bugs
-   Optimise performance or code structure
-   Refactor or simplify components

#### Tech Stack

-   **Framework**: [Next.js](https://nextjs.org/) (App Router)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Icons**: [Lucide](https://lucide.dev/)

#### Guidelines

-   Follow existing file and folder structure
-   Keep components composable and reusable
-   Use Tailwind utility classes for all styling
-   Use TypeScript where appropriate
-   Keep commits focused and well-documented

> If you’re unsure where to start, check the [open issues](https://github.com/DanielButler1/AI-Stats/issues) for bugs or feature suggestions tagged with `good first issue`.

</details>

### 💡 Ideas and Feedback

-   Suggest UI/UX improvements
-   Recommend new data fields to track
-   Propose automation or dashboard tools

Even just opening an issue to start a conversation helps us improve!

---

## ⚙️ Setting Up Locally

1. Clone the repo:

    ```bash
    git clone https://github.com/DanielButler1/AI-Stats.git
    cd ai-model-stats
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Start the development server:

    ```bash
    npm run dev
    ```

4. Visit `http://localhost:3000`

---

## 🔄 Submitting a Pull Request

1. **Fork** the repository
2. **Create a new branch** (`git checkout -b feature-name`)
3. **Make your changes** (code or data)
4. **Commit and push** your branch
5. Open a **pull request** with a clear description of what you’ve done

We'll review your submission and provide feedback if needed!

---

## ✅ Code Guidelines

-   Write clean, readable code with clear variable names
-   Prefer functional, composable components (Next.js)
-   Keep styling in Tailwind CSS classes
-   Data files must be valid JSON with consistent field naming

---

## 🗣️ Questions or Ideas?

-   [Open an Issue](https://github.com/DanielButler1/AI-Stats/issues)
-   DM us on Twitter [@DanielButler001](https://twitter.com/DanielButler001)
-   Join our [Discord community](https://discord.gg/zDw73wamdX)

Thanks again for being here - let’s build something great together 🚀
