import os

db_URI = os.getenv('DATABASE_URL', 'postgres://localhost:5432/lovers_db')
secret = os.getenv('SECRET', 'You Complete Me <3')