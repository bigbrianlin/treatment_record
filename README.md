# Treatment Record (SOAP Notes Application)

A full-stack medical record system designed to help healthcare professionals manage patient profiles and write SOAP (Subjective, Objective, Assessment, Plan) notes efficiently. 

## 🚀 Features

* **Secure Authentication**: User registration and login powered by JWT and Passport.js.
* **Patient Management**: Easily create, view, and manage patient records.
* **Rich Text Editing**: Integrated Tiptap editor for seamless and intuitive SOAP note formatting.
* **RESTful API**: Robust backend built with Express.js and MongoDB.
* **Responsive UI**: Built with Next.js and styled for a modern user experience.

## 🛠️ Tech Stack

### Frontend (Client)
* **Framework**: [Next.js](https://nextjs.org/) (v15) & React (v19)
* **Rich Text Editor**: [Tiptap](https://tiptap.dev/)
* **HTTP Client**: Axios
* **Icons**: Lucide React

### Backend (Server)
* **Runtime**: Node.js
* **Framework**: Express.js
* **Database**: MongoDB (Mongoose)
* **Authentication**: Passport.js & JSON Web Tokens (JWT)
* **Security & Validation**: Bcrypt (Password Hashing), Joi (Data Validation), CORS

## 💻 Getting Started

Follow these steps to set up the project locally.

### Prerequisites
* Node.js installed on your machine.
* MongoDB running locally or a MongoDB Atlas connection string.

### 1. Clone the repository
```bash
git clone [https://github.com/bigbrianlin/treatment_record.git](https://github.com/bigbrianlin/treatment_record.git)
cd treatment_record
