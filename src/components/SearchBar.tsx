import React, { useState, useEffect } from "react";
import { TextField, Button, Box, MenuItem, Select, InputLabel, FormControl } from "@mui/material";

interface SearchBarProps {
    onSearch: (query: string, year: string, type: string) => void;
    initialValues: {
        query: string;
        year: string;
        type: string;
    };
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, initialValues }) => {
    const [query, setQuery] = useState(initialValues.query);
    const [year, setYear] = useState(initialValues.year);
    const [type, setType] = useState(initialValues.type);

    useEffect(() => {
        setQuery(initialValues.query);
        setYear(initialValues.year);
        setType(initialValues.type);
    }, [initialValues]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(query.trim(), year.trim(), type);
    };

    const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newQuery = e.target.value;
        setQuery(newQuery);

        if (!newQuery && !year && !type) {
            onSearch("", "", "");
        }
    };

    return (
        <form onSubmit={handleSearch}>
            <Box 
                sx={{ 
                    display: 'flex', 
                    gap: 2, 
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 3
                }}
            >
                <TextField
                    label="Search Movie"
                    variant="outlined"
                    value={query}
                    onChange={handleQueryChange}
                    required
                />
                <TextField
                    label="Year (Optional)"
                    variant="outlined"
                    type="number"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    sx={{ minWidth: 180 }}
                />
                <FormControl variant="outlined" sx={{ minWidth: 180 }}>
                    <InputLabel>Type (Optional)</InputLabel>
                    <Select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        label="Type (Optional)"
                    >
                        <MenuItem value="">All</MenuItem>
                        <MenuItem value="movie">Movie</MenuItem>
                        <MenuItem value="series">Series</MenuItem>
                    </Select>
                </FormControl>
                <Button 
                    variant="contained" 
                    color="primary" 
                    type="submit"
                    sx={{ minHeight: 55 }}
                >
                    Search
                </Button>
            </Box>
        </form>
    );
};

export default SearchBar;