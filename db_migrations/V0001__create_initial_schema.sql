-- Создание таблиц для казино-платформы Rocket Queen

-- Таблица пользователей
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    referral_code VARCHAR(20) UNIQUE NOT NULL,
    referred_by_code VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица балансов
CREATE TABLE balances (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    main_balance DECIMAL(10, 2) DEFAULT 0.00 CHECK (main_balance >= 0),
    bonus_balance DECIMAL(10, 2) DEFAULT 0.00 CHECK (bonus_balance >= 0),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- Таблица транзакций
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    type VARCHAR(50) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    balance_type VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица игровых раундов
CREATE TABLE game_rounds (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    bet_amount DECIMAL(10, 2) NOT NULL,
    multiplier DECIMAL(10, 2),
    crash_point DECIMAL(10, 2) NOT NULL,
    win_amount DECIMAL(10, 2) DEFAULT 0.00,
    is_winner BOOLEAN DEFAULT FALSE,
    auto_cashout DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица рефералов
CREATE TABLE referrals (
    id SERIAL PRIMARY KEY,
    referrer_user_id INTEGER REFERENCES users(id),
    referred_user_id INTEGER REFERENCES users(id),
    bonus_amount DECIMAL(10, 2) DEFAULT 200.00,
    is_card_completed BOOLEAN DEFAULT FALSE,
    bonus_paid BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(referred_user_id)
);

-- Индексы для оптимизации
CREATE INDEX idx_users_referral_code ON users(referral_code);
CREATE INDEX idx_users_referred_by ON users(referred_by_code);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_game_rounds_user_id ON game_rounds(user_id);
CREATE INDEX idx_referrals_referrer ON referrals(referrer_user_id);
CREATE INDEX idx_referrals_referred ON referrals(referred_user_id);