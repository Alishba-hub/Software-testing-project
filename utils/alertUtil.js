class AlertUtil {
  static async acceptNextDialog(page, messageIncludes = "") {
    page.once("dialog", async (dialog) => {
      if (messageIncludes && !dialog.message().includes(messageIncludes)) {
        await dialog.dismiss();
        return;
      }
      await dialog.accept();
    });
  }

  static async dismissNextDialog(page, messageIncludes = "") {
    page.once("dialog", async (dialog) => {
      if (messageIncludes && !dialog.message().includes(messageIncludes)) {
        await dialog.accept();
        return;
      }
      await dialog.dismiss();
    });
  }
}

module.exports = { AlertUtil };
