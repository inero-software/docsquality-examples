# DocsQuality python example

## Installation

1. Create a virtual environment

    ```bash
    python -m venv venv
    ```

2. Activate the virtual environment

    - **Windows**

        ```bash
        venv\Scripts\activate
        ```

    - **Linux**

        ```bash
        source venv/bin/activate
        ```

3. Install project dependencies

    ```bash
    pip install -r requirements.txt
    ```

4. Enter your credentials (available in your [DocsQuality](https://app.docsquality.com/) account)

   Open the `.env` file and replace the `YOUR_CLIENT_ID`, `YOUR_CLIENT_SECRET` placeholders with your DocsQuality
   credentials.

    ```env
    CLIENT_ID=YOUR_CLIENT_ID
    CLIENT_SECRET=YOUR_CLIENT_SECRET
    ```

**Note: do not upload confidential documents.**

For a **fully private** (standalone) version,
check out [DocsQuality offline integration](https://docs.app.docsquality.com/usage.html#offline-integration).

## Usage

```bash
python predict.py --file <path_to_file>
```

Additional parameters:

- `--ocr-index`(bool) - determines whether the document will be correctly interpreted by the Optical Character
  Recognition (OCR) program.
- `--doc-category`(bool) - determines the overall category of the document.
- `--page-category`(bool) - determines the category of each page in the document.

Example usage with additional parameters:

```bash
python predict.py --file <path_to_file> --ocr-index --doc-category --page-category
```