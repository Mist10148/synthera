# synthera
website finals for my little Nico


---

# Running `app.py`

This guide will help you set up and run the Flask application.

## 1. Install Required Packages

Before running the app, install the necessary Python packages using:

```bash
pip install flask flask-cors google-generativeai
```

## 2. Set Your API Key

> **Important:** Don’t forget to input your API key before running the application.
> You can usually set it in your environment or directly in your code (depending on how your app expects it). For example:

```python
import os
os.environ["YOUR_API_KEY"] = "YOUR_API_KEY_HERE"
```

or follow the instructions in `app.py` to input your key.

## 3. Run the Application

To start the Flask server, run:

```bash
python app.py
```

The app should now be running and accessible on `http://127.0.0.1:5000` (or another port if specified).

---


