export const APISettings = {
    token: '',
    headers: new Headers({
        'Accept': 'application/json'
    }),
    baseURL: 'localhost:8000/api/',
}

export const APIRequests = {
    getAllCharacters: async () => {
        const response = await fetch(
            "http://localhost:8000/api/character",
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        )
        return await response.json()
    }
}