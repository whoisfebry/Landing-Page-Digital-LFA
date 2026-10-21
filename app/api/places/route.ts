import { NextRequest, NextResponse } from "next/server";

const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

export async function GET(request: NextRequest) {
    if (!GOOGLE_API_KEY) {
        return NextResponse.json(
            { error: "Google Maps API key belum dikonfigurasi." },
            { status: 500 }
        );
    }

    const input = request.nextUrl.searchParams.get("input")?.trim();
    const placeId = request.nextUrl.searchParams.get("placeId");

    try {
        // Ambil koordinat dan alamat tempat yang dipilih.
        if (placeId) {
            const response = await fetch(
                `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`,
                {
                    headers: {
                        "X-Goog-Api-Key": GOOGLE_API_KEY,
                        "X-Goog-FieldMask":
                            "id,displayName,formattedAddress,location",
                    },
                    cache: "no-store",
                }
            );

            const data = await response.json();

            if (!response.ok) {
                return NextResponse.json(
                    { error: data.error?.message ?? "Detail lokasi gagal dimuat." },
                    { status: response.status }
                );
            }

            if (
                typeof data.location?.latitude !== "number" ||
                typeof data.location?.longitude !== "number"
            ) {
                return NextResponse.json(
                    { error: "Koordinat lokasi tidak tersedia." },
                    { status: 404 }
                );
            }

            return NextResponse.json({
                placeId: data.id,
                name: data.displayName?.text ?? "",
                address: data.formattedAddress ?? "",
                lat: data.location.latitude,
                lon: data.location.longitude,
            });
        }

        // Ambil saran lokasi ketika pengguna mengetik.
        if (!input || input.length < 3) {
            return NextResponse.json({ suggestions: [] });
        }

        const response = await fetch(
            "https://places.googleapis.com/v1/places:autocomplete",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Goog-Api-Key": GOOGLE_API_KEY,
                    "X-Goog-FieldMask":
                        "suggestions.placePrediction.placeId,suggestions.placePrediction.text,suggestions.placePrediction.structuredFormat",
                },
                body: JSON.stringify({
                    input,
                    includedRegionCodes: ["id"],
                    languageCode: "id",
                    regionCode: "ID",
                    includeQueryPredictions: false,
                    sessionToken: request.nextUrl.searchParams.get("sessionToken") ?? undefined,
                }),
                cache: "no-store",
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { error: data.error?.message ?? "Pencarian lokasi gagal." },
                { status: response.status }
            );
        }

        const suggestions = (data.suggestions ?? [])
            .filter((item: any) => item.placePrediction)
            .map((item: any) => {
                const place = item.placePrediction;

                return {
                    placeId: place.placeId,
                    name:
                        place.structuredFormat?.mainText?.text ??
                        place.text?.text ??
                        "Lokasi",
                    address:
                        place.structuredFormat?.secondaryText?.text ?? "",
                    description: place.text?.text ?? "",
                };
            });

        return NextResponse.json({ suggestions });
    } catch {
        return NextResponse.json(
            { error: "Tidak dapat menghubungi layanan Google Maps." },
            { status: 502 }
        );
    }
}
