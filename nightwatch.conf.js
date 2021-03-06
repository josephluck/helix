module.exports = {
  src_folders: ["tmp/tests/specs"],
  output_folder: "reports",
  custom_commands_path: "",
  custom_assertions_path: "",
  page_objects_path: "",
  globals_path: "",
  silent: true,

  selenium: {
    start_process: true,
    server_path: require('selenium-server').path,
    log_path: "",
    port: 8371
  },

  test_settings: {
    default: {
      launch_url: "http://localhost",
      selenium_port: 8371,
      selenium_host: "localhost",
      silent: true,
      screenshots: {
        enabled: true,
        on_failure: true,
        on_error: true,
        path: "./shots"
      },
      desiredCapabilities: {
        browserName: "chrome",
        marionette: true
      }
    }
  }
}