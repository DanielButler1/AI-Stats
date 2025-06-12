# 🤝 Contributing to AI Model Stats

Thank you for your interest in contributing to **AI Model Stats**! This is a community-driven project, and we welcome contributions from **everyone**, whether you're a seasoned developer, AI researcher, or simply someone passionate about tracking the evolution of language models.

---

## 🧠 What Can You Contribute?

### 🔍 Model Data

-   Add a new **AI Provider**
-   Add a new **AI model**
-   Update **benchmark results**
-   Update existing model data
-   Fix incorrect or outdated information
-   Add new fields to improve transparency

Model data is stored in JSON format inside the `/models` folder. Follow the format of existing files.

> **Important:** Before adding a new model, check that the model's **provider** exists in the `/providers` folder. If the provider is not listed, you'll need to create a new provider entry first before adding the models.
> This also applies to benchmarks - ensure the benchmark exists in the `/benchmarks` folder before adding results. As well as applying to API providers, which are stored in the `/api_providers` folder.

### 🛠 Website Development

-   Improve UI or add new features
-   Fix bugs
-   Optimise performance or structure

We use **Next.js**, **Tailwind CSS**.

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
-   Start a [GitHub Discussion](#)
-   DM us on Twitter [@DanielButler001](#)
-   Join our [Discord community](#)

Thanks again for being here - let’s build something great together 🚀
