export type Coordinates = {
	lat: number
	lon: number
}

export type Sweref99Coordinates = {
	northing: number
	easting: number
}

export type Position = {
	id: string
	name: string
	coordinates: Coordinates
	sweref99Coordinates: Sweref99Coordinates
	address: string
}
