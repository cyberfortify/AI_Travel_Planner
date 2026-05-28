import { useEffect, useState } from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";


/* FIX DEFAULT MARKER ISSUE */

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({

    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

    iconUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

    shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});



export default function TripMapSection({

    result,

    isMobile,

}) {
    const [coords, setCoords] = useState([20.5937, 78.9629]);
    if (!result) return null;

    useEffect(() => {

        const fetchCoords = async () => {

            try {

                const res = await fetch(

                    `https://nominatim.openstreetmap.org/search?format=json&q=${result.destination}`

                );

                const data = await res.json();

                if (data?.length > 0) {

                    setCoords([
                        parseFloat(data[0].lat),
                        parseFloat(data[0].lon),
                    ]);
                }

            } catch (err) {

                console.log(
                    "Map geocoding failed",
                    err
                );
            }
        };

        fetchCoords();

    }, [result.destination]);


    return (

        <div
            style={{
                marginTop: '6rem',
                marginBottom: 4,
            }}
        >

            {/* HEADER */}
            <div
                style={{
                    marginBottom: 18,
                }}
            >

                <p
                    style={{
                        color: "#00d4e0",
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: 1.2,
                        textTransform: "uppercase",
                        margin: "0 0 6px",
                    }}
                >
                    ROUTE OVERVIEW
                </p>

                <h2
                    style={{
                        color: "#fff",

                        fontSize:
                            isMobile
                                ? 24
                                : 32,

                        fontWeight: 800,

                        margin: 0,
                    }}
                >
                    Explore Your Journey
                </h2>

            </div>

            {/* MAP */}
            <div
                style={{
                    overflow: "hidden",

                    borderRadius: 28,

                    border:
                        "1px solid rgba(255,255,255,.06)",

                    background:
                        "rgba(255,255,255,.03)",

                    backdropFilter:
                        "blur(18px)",
                }}
            >

                <MapContainer
                    key={coords.join("-")}
                    center={coords}
                    zoom={11}

                    style={{
                        width: "100%",
                        height:
                            isMobile
                                ? "340px"
                                : "500px",
                    }}
                >

                    {/* DARK MAP */}
                    <TileLayer
                        attribution='&copy; OpenStreetMap contributors'

                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    />

                    {/* DESTINATION */}
                    <Marker position={coords}>

                        <Popup>
                            📍 {result.destination}
                        </Popup>

                    </Marker>

                    {/* HOTELS */}
                    {result.hotels?.map((hotel) => {

                        // SAFETY CHECK
                        if (
                            typeof hotel.latitude !== "number" ||
                            typeof hotel.longitude !== "number"
                        ) {
                            return null;
                        }

                        return (

                            <Marker
                                key={hotel.id || hotel.name}

                                position={[
                                    hotel.latitude,
                                    hotel.longitude,
                                ]}
                            >

                                <Popup>

                                    <div
                                        style={{
                                            minWidth: 140,
                                        }}
                                    >

                                        <strong>
                                            {hotel.name}
                                        </strong>

                                        <br />

                                        ₹{hotel.price}

                                    </div>

                                </Popup>

                            </Marker>
                        );
                    })}

                </MapContainer>

            </div>

        </div>
    );
}