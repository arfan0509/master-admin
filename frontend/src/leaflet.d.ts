import "leaflet";

declare module "leaflet" {
  interface MapOptions {
    center?: [number, number];
  }
}