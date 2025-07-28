import { useState, useEffect } from "react";


const Home = () => {
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedLocation, setSelectedLocation] = useState("");

    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = async () => {
        const data = await getItems();
        setItems(data);
        setFilteredItems(data);
    };

    const handleDateFilter = (e) => {
        const date = e.target.value;
        setSelectedDate(date);
        const filtered = items.filter(item => item.date === date);
        setFilteredItems(filtered);
    };
    
    const handleLocationFilter = (e) => {
        const location = e.target.value;
        setSelectedLocation(location);
        const filtered = items.filter(item => item.location === location);
        setFilteredItems(filtered);
    };

    const clearFilters = () => {
        setSelectedDate("");
        setSelectedLocation("");
        setFilteredItems(items);
    }

    const dates = [...new Set(items.map(item => item.date))];
    const locations = [...new Set(items.map(item => item.location))];
    return (
        
        <section className="" style={{margin: 80}}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                    <FormControl fullWidth={true}>
                        <InputLabel id="date-label">Fecha:</InputLabel>
                        <Select value={selectedDate} onChange={handleDateFilter}>
                            <MenuItem value="">Filtrar por fecha</MenuItem>
                            {dates.map(date => (
                                <MenuItem key={date} value={date}>{date}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                    <FormControl fullWidth={true}>
                        <InputLabel id="location-label">Ubicación:</InputLabel>
                        <Select value={selectedLocation} onChange={handleLocationFilter}>
                            <MenuItem value="">Filtrar por ubicación</MenuItem>
                            {locations.map(location => (
                                <MenuItem key={location} value={location}>{location}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Button variant="contained" onClick={clearFilters} sx={{bgcolor: "#3a043a"}} style={{height:55}}>Limpiar filtros</Button>
                </Grid>
            </Grid>
            <h1 style={{margin: 20}}>Eventos</h1>
            <div className="event-list" style={{margin: 20}}>
                {filteredItems.map(item => (
                    <div key={item._id} className="event-card" style={{margin: 20}}>
                        <h3>{item.name}</h3>
                        <p style={{marginBottom: 20, marginTop: 20}}>{item.description}</p>
                        <div style={{display:"flex",gap: 20}}>
                            <p><strong>Fecha:</strong> {item.date}</p>
                            <p><strong>Hora:</strong> {item.time}</p>
                            <p><strong>Lugar:</strong> {item.location}</p>
                        </div>
                        
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Home;