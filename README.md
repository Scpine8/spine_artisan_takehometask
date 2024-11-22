# Sean Pine Take Home Project for Artisan AI

I had pleasure putting this together. Thank you all for the opportunity!

## Setup Instructions

### Install Dependencies:

**Backend**

1. Ensure you have python and pip installed. Then run `pip install -r requirements.txt` from the /backend directory.
2. Importantly, use the OpenAI secret that I shared via email through a secure link to Sinead. This secret must be pasted in a `.env` file in your `/backend` directory. _You need to complete this step in order for the Chat Bot to work_
3. To run the FastAPI server, run `uvicorn main:app --reload`. Navigate to the `/docs` path of the server url to see the API docs.

**Frontend**

1. Use your favorite package manager to install the contents of `package.json`
2. Run the `dev` script to serve the plugin

#### Noteable Dependencies:

**Backend**

- FastAPI
- Pydantic
- OpenAI

**Frontend**

- Shadcn/ui
- lucid-react (for iconography)
- axios

#### Testing

- Jest / PyTest for Unit Testing
