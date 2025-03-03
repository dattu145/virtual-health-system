import google.generativeai as genai

genai.configure(api_key="AIzaSyBXEgUi5dc2pwmZl2B4U8PT4HDnPfIVa8w")
model = genai.GenerativeModel("gemini-1.5-flash")
response = model.generate_content("i have fever how to overcome it")
print(response.text)