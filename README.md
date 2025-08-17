
---

# 📝 AI Meeting Notes Summarizer

Transform your meeting transcripts into **clear, structured, and actionable summaries** powered by AI. This app allows you to upload or paste transcripts, generate summaries, edit and format them, and instantly share via email.
Deployed Link : https://ai-meeting-summarizer-puce.vercel.app/

---

## 🚀 Features

* 📂 **Upload or Paste Transcripts** – Supports `.txt`.
* 🤖 **AI-Powered Summaries** – Uses Groq’s LLaMA model to generate concise, structured notes.
* 🛠 **Custom Instructions** – Choose templates (Executive Summary, Action Items, etc.) or add your own.
* ✍️ **Edit & Format** – Copy, download, or auto-format summaries before sending.
* 📧 **Email Integration** – Send summaries to multiple recipients with subject, message, and priority.
* 📊 **Quick Stats** – Track transcript length, summary length, and compression ratio.
* 📜 **History** – Access up to 10 previously generated summaries from local storage.

---

## 🏗 Tech Stack

### **Frontend**

* [Next.js](https://nextjs.org/) (React Framework)
* [Bootstrap](https://getbootstrap.com/) + Custom Styling
* [Lucide React](https://lucide.dev/) (icons)

### **Backend / API**

* Next.js API Routes
* [Groq API](https://groq.com/) (OpenAI-compatible, LLaMA 3.1 model)
* [Nodemailer](https://nodemailer.com/) (for sending emails)

### **Storage**

* LocalStorage for summary history
* React state hooks for UI state management

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/ai-meeting-notes-summarizer.git
cd ai-meeting-notes-summarizer
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
# Groq / OpenAI API
OPENAI_API_KEY=your_groq_api_key

# Email configuration (SMTP)
EMAIL_HOST=smtp.yourmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_password
```

### 4. Run the development server

```bash
npm run dev
```

App will be live at [http://localhost:3000](http://localhost:3000)

---

## 📌 Usage

1. **Upload Transcript** – Drag & drop or paste transcript text.
2. **Choose Instructions** – Select a template or write your own.
3. **Generate Summary** – AI processes the transcript and outputs a summary.
4. **Edit & Format** – Review, refine, and format the summary.
5. **Send via Email** – Share with your team instantly.
6. **Check Stats & History** – Monitor compression ratio and revisit past summaries.

---

## 📂 Project Structure

```
.
├── components/
│   ├── FileUpload.js       # Upload & paste transcripts
│   ├── SummaryEditor.js    # Edit, format, download summaries
│   ├── EmailForm.js        # Email sending form
├── pages/
│   ├── index.js            # Main UI flow
│   ├── api/
│   │   ├── generate-summary.js  # AI summarization endpoint
│   │   ├── send-email.js        # Email sending endpoint
```

---

## 📬 Email Example

* **Subject**: Meeting Summary
* **Body**: Includes your custom message + formatted AI summary with timestamps.
* **Priority**: Low | Normal | High

---

