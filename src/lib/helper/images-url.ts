export const convertTravelImageUrl = (image: string) => {
    return `${process.env.NEXT_PUBLIC_TRAVEL_PACKAGES_API_URL}/public/travel-images/${image}`
}
export const convertCarImageUrl = (image: string) => {
    return `${process.env.NEXT_PUBLIC_CARS_API_URL}/public/car-images/${image}`
}