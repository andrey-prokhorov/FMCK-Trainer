using FMCK.Trainer.Api.Models;
using FMCK.Trainer.Api.Services;
using Xunit;

namespace FMCK.Trainer.Tests.Services;

public class CoordinateConverterTests
{
    [Fact]
    public void Convert_ValidWgs84Coordinates_ReturnsExpectedSweref99Coordinates()
    {
        // Example coordinates for Stockholm Central Station
        var wgs84 = new Wgs84Coordinates { Lat = 59.330231, Lon = 18.059196 };

        var result = CoordinateConverter.Convert(wgs84);

        // SWEREF99 TM expected values
        Assert.Equal(6580822, result.Northing);
        Assert.Equal(674032, result.Easting);
    }

    [Fact]
    public void Convert_InvalidCoordinates_ThrowsException()
    {
        // Invalid latitude and longitude
        var wgs84 = new Wgs84Coordinates { Lat = 999, Lon = 999 };

        Assert.Throws<Exception>(() => CoordinateConverter.Convert(wgs84));
    }


    [Theory]
    [InlineData(1.5, 2)]
    [InlineData(2.5, 3)] // When using "MidpointRounding.ToEven": Banker's rounding: 2.5 -> 2
    [InlineData(-1.5, -2)]
    [InlineData(-2.5, -3)] // When using "MidpointRounding.ToEven": Banker's rounding: -2.5 -> -2
    public void RoundToMeters_UsesAwayFromZero(double input, double expected)
    {
        var result = CoordinateConverter.RoundToMeters(input);
        Assert.Equal(expected, result);
    }

    [Theory]
    [InlineData(0, 0, true)]
    [InlineData(90, 180, true)]
    [InlineData(-90, -180, true)]
    [InlineData(91, 0, false)]
    [InlineData(-91, 0, false)]
    [InlineData(0, 181, false)]
    [InlineData(0, -181, false)]
    public void IsValidWgs84_CheckRanges(double lat, double lon, bool expected)
    {
        var coords = new Wgs84Coordinates { Lat = lat, Lon = lon };
        Assert.Equal(expected, CoordinateConverter.IsValidWgs84(coords));
    }

    [Fact]
    public void IsValidWgs84_ReturnsFalseForNaN()
    {
        var coordsLatNaN = new Wgs84Coordinates { Lat = double.NaN, Lon = 0 };
        var coordsLonNaN = new Wgs84Coordinates { Lat = 0, Lon = double.NaN };
        Assert.False(CoordinateConverter.IsValidWgs84(coordsLatNaN));
        Assert.False(CoordinateConverter.IsValidWgs84(coordsLonNaN));
    }    
}