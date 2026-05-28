import HotelCard from "../HotelCard";
import HotelModal from "../HotelModal";

export default function HotelSection({

  result,

  isMobile,

  hotelLoading,

  selectedHotel,

  setSelectedHotel,

  handleLikeHotel,

  likedHotels,

}) {

  if (!result) return null;

  return (

    <div
      style={{
        marginTop: 48,
      }}
    >

      {/* HEADER */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 14,
          flexWrap: "wrap",

          marginBottom: 22,
        }}
      >

        <div>

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
            CURATED STAYS
          </p>

          <h2
            style={{
              color: "#fff",
              fontSize:
                isMobile ? 24 : 34,

              fontWeight: 800,
              margin: 0,
            }}
          >
            Recommended Hotels
          </h2>

        </div>

        <p
          style={{
            color: "rgba(255,255,255,.4)",
            fontSize: 13,
            lineHeight: 1.6,
            maxWidth: 340,
            margin: 0,
          }}
        >
          AI-selected stays based on
          destination, budget and
          travel experience.
        </p>

      </div>

      {/* LOADING */}
      {hotelLoading ? (

        <div
          style={{
            display: "grid",

            gridTemplateColumns:
              isMobile
                ? "1fr"
                : "repeat(3,1fr)",

            gap: 18,
          }}
        >

          {[1, 2, 3].map((i) => (

            <div
              key={i}

              style={{
                height: 340,

                borderRadius: 28,

                background:
                  "linear-gradient(180deg,rgba(255,255,255,.06),rgba(255,255,255,.03))",

                border:
                  "1px solid rgba(255,255,255,.05)",

                animation:
                  "pulse 1.5s infinite",
              }}
            />

          ))}

        </div>

      ) : (

        <div
          style={{
            display: "grid",

            gridTemplateColumns:
              isMobile
                ? "1fr"
                : "repeat(3,1fr)",

            gap: 20,
          }}
        >

          {result.hotels?.map((hotel, i) => (

            <HotelCard
              key={i}

              hotel={hotel}

              isMobile={isMobile}

              onClick={setSelectedHotel}
            />

          ))}

        </div>

      )}

      {/* HOTEL MODAL */}
      <HotelModal

        hotel={selectedHotel}

        onClose={() =>
          setSelectedHotel(null)
        }

        isMobile={isMobile}

        onLike={handleLikeHotel}

        liked={
          likedHotels.some(
            h =>
              h.name ===
              selectedHotel?.name
          )
        }

      />
    </div>
  );
}