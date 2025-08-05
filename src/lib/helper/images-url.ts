export const convertTravelImageUrl = (image: string) => {
    return `${process.env.NEXT_PUBLIC_TRAVEL_PACKAGES_API}/public/travel-images/${image}`
}
export const convertCarImageUrl = (image: string) => {
    return `${process.env.NEXT_PUBLIC_CARS_API}/public/car-images/${image}`
}