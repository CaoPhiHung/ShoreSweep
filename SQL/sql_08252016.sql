USE [ShoreSweep]
GO

/****** Object:  Table [dbo].[Assignees]    Script Date: 8/25/2016 10:27:04 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Assignees](
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
	[UserName] [nvarchar](max) NOT NULL,
 CONSTRAINT [PK_dbo.Assignees] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO

/****** Object:  Table [dbo].[Polygons]    Script Date: 8/25/2016 10:27:56 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Polygons](
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](max) NULL,
	[Coordinates] [nvarchar](max) NULL,
 CONSTRAINT [PK_dbo.Polygons] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO

/****** Object:  Table [dbo].[TrashInformations]    Script Date: 8/25/2016 10:28:13 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[TrashInformations](
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
	[TrashID] [bigint] NOT NULL,
	[Latitude] [float] NOT NULL,
	[Longitude] [float] NOT NULL,
	[Continent] [nvarchar](max) NULL,
	[Country] [nvarchar](max) NULL,
	[AdministrativeArea1] [nvarchar](max) NULL,
	[AdministrativeArea2] [nvarchar](max) NULL,
	[AdministrativeArea3] [nvarchar](max) NULL,
	[Locality] [nvarchar](max) NULL,
	[SubLocality] [nvarchar](max) NULL,
	[Description] [nvarchar](max) NULL,
	[Comment] [nvarchar](max) NULL,
	[Status] [int] NOT NULL,
	[Url] [nvarchar](max) NULL,
	[Images] [nvarchar](max) NULL,
	[Size] [nvarchar](max) NULL,
	[Type] [nvarchar](max) NULL,
	[AssigneeID] [bigint] NULL,
	[ModifiedDate] [datetime] NOT NULL,
	[SectionID] [bigint] NULL,
 CONSTRAINT [PK_dbo.TrashInformations] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO

