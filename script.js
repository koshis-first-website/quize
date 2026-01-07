body {
    background: linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%); /* Calming Green */
    font-family: 'Helvetica Neue', Arial, sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
}

.quiz-container {
    background: rgba(255, 255, 255, 0.9);
    width: 90%;
    max-width: 450px;
    padding: 30px;
    border-radius: 25px;
    box-shadow: 0 15px 35px rgba(0,0,0,0.1);
    text-align: center;
}

.zen-header {
    display: flex;
    justify-content: space-between;
    color: #555;
    font-size: 0.8rem;
    margin-bottom: 20px;
    text-transform: uppercase;
    letter-spacing: 1px;
}

h2 { color: #2d5a27; font-weight: 400; line-height: 1.5; }

.btn {
    background: white;
    color: #444;
    border: 2px solid #e0e0e0;
    padding: 15px;
    margin: 5px 0;
    border-radius: 12px;
    cursor: pointer;
    width: 100%;
    font-size: 1rem;
    transition: all 0.3s ease;
}

.btn:hover { border-color: #96e6a1; background: #f9fff9; }

.correct { background: #96e6a1 !important; color: white; border-color: #74c77f; }
.wrong { background: #ffb3b3 !important; color: white; border-color: #ff8080; }

#next-btn {
    background: #2d5a27;
    color: white;
    border: none;
    padding: 15px 30px;
    border-radius: 50px;
    cursor: pointer;
    margin-top: 20px;
    width: 100%;
    font-size: 1rem;
}

.hide { display: none; }
