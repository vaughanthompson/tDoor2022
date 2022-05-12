var pb_Site_Admin = {

    /// Sets the site as the default site in the pbSite table, and sets other sites to not default.
    setDefaultSite: function (siteId) {        
        $.post("/pbAdmin/SetDefaultSite", { siteId: siteId })
          .done(function (data) {
              defaultSiteUpdated(siteId); // This needs to exist on the page.
          });
    }
}