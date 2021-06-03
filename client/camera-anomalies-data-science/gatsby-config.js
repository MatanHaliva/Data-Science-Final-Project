module.exports = {
  siteMetadata: {
    title: "camera-anomalies-data-science",
  },
  plugins: [
    "gatsby-plugin-fontawesome-css",
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-fontawesome-css",
    "gatsby-plugin-sass",
    "gatsby-plugin-gatsby-cloud",
    {
      resolve: "gatsby-plugin-google-analytics",
      options: {
        trackingId: "12",
      },
    },
  ],
};
