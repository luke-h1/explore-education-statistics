-- Create a view using the WITH SCHEMABINDING option
CREATE VIEW dbo.ObservationSubjectIdGeographicLevel
    WITH SCHEMABINDING
    AS
    SELECT
        SubjectId,
        GeographicLevel,
        COUNT_BIG(*) AS Count
    FROM dbo.Observation
    INNER JOIN dbo.Location
    ON Observation.LocationId = Location.Id
    GROUP BY SubjectId, GeographicLevel
GO

-- Create an index on the view
CREATE UNIQUE CLUSTERED INDEX IX_ObservationSubjectIdGeographicLevel_SubjectId_GeographicLevel
    ON dbo.ObservationSubjectIdGeographicLevel(SubjectId,GeographicLevel)
GO
