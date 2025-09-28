# ShibaDB

ShibaDB is a free database service designed for Hackclub Shiba game developers. It provides a simple REST API to store and manage player data, including save games and leaderboards, with secure token-based access and built-in analytics.

## Features

-   **Easy Integration**: REST API for quick data storage and retrieval.
-   **Secure Tokens**: Unique game tokens for protected access.
-   **Real-time Analytics**: Track player engagement and game stats.
-   **Slack Authentication**: Seamless login via Slack for developers.

## Getting Started

1. Clone the repository:

    ```bash
    git clone https://github.com/RafaeloxMC/shibadb.git
    cd shibadb
    ```

2. Install dependencies:

    ```bash
    yarn install
    ```

3. Set up environment variables (see .env example).

4. Run the development server:
    ```bash
    yarn run dev
    ```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Tech Stack

-   **Frontend**: Next.js, React, Tailwind CSS
-   **Backend**: Next.js API Routes, MongoDB with Mongoose
-   **Authentication**: Slack OAuth

For more details, check the [API documentation](https://github.com/RafaeloxMC/shibadb/wiki) or contribute on [GitHub](https://github.com/RafaeloxMC/shibadb).
