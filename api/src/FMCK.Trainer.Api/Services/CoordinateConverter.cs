using System.Runtime.CompilerServices;
using FMCK.Trainer.Api.Models;
using Programmerare.CrsTransformations.Coordinate;
using Programmerare.CrsConstants.ConstantsByAreaNameNumber.v10_036;
using Programmerare.CrsTransformations.CompositeTransformations;

namespace FMCK.Trainer.Api.Services;

public static class CoordinateConverter
{
    public static double RoundToMeters(double meters)
        => Math.Round(meters, 0, MidpointRounding.AwayFromZero);

    public static bool IsValidWgs84(Wgs84Coordinates c) =>
        c.Lat >= -90 && c.Lat <= 90 &&
        c.Lon >= -180 && c.Lon <= 180 &&
        !double.IsNaN(c.Lat) &&
        !double.IsNaN(c.Lon);


    public static Sweref99Coordinates Convert(Wgs84Coordinates coordinates)
    {
        return new Sweref99Coordinates
        {
            Northing = 0,
            Easting = 0
        };
        
        var epsgWgs84 = EpsgNumber.WORLD__WGS_84__4326;
        var epsgSweRef = EpsgNumber.SWEDEN__SWEREF99_TM__3006;

        if (!IsValidWgs84(coordinates))
            throw new Exception("Invalid WGS84 coordinates: " + coordinates.Lat + ", " + coordinates.Lon);

        var coordinateWgs84 = CrsCoordinateFactory.LatLon(coordinates.Lat, coordinates.Lon, epsgWgs84);

        var crsTransformationAdapter =
            CrsTransformationAdapterCompositeFactory.Create().CreateCrsTransformationMedian();

        var resultSweRef = crsTransformationAdapter.Transform(coordinateWgs84, epsgSweRef);


        if (!resultSweRef.IsSuccess) throw new Exception("Coordinate transformation failed: " + resultSweRef.Exception);

        var northing = RoundToMeters(resultSweRef.OutputCoordinate.Northing);
        var easting = RoundToMeters(resultSweRef.OutputCoordinate.Easting);

        return new Sweref99Coordinates
        {
            Northing = northing,
            Easting = easting
        };
    }
}