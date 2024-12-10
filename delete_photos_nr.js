// How many photos to delete?
// Put a number value, like this
// const maxImageCount = 5896
const maxImageCount = "ALL_PHOTOS";

// Selector for Images and buttons
const ELEMENT_SELECTORS = {
  checkboxClass: ".ckGgle",
  languageAgnosticDeleteButton: "div[data-delete-origin] button",
  deleteButton:
    "#yDmH0d > div.uW2Fw-Sx9Kwc.uW2Fw-Sx9Kwc-OWXEXe-n2to0e.uW2Fw-Sx9Kwc-OWXEXe-wdeprb-MD85tf-DKzjMe.V639qd.lQCeof.oEOLpc.A9Uzve.uW2Fw-Sx9Kwc-OWXEXe-FNFY6c > div.uW2Fw-wzTsW.O4g5Md.iWO5td > div > div.uW2Fw-cnG4Wd.m5OsGf > div > div.uW2Fw-T0kwCb.IdSMxc > button:nth-child(2)",
  confirmationButton:
    'div[aria-modal="true"] > div > div > div > button:nth-of-type(2)',
};

// Time Configuration (in milliseconds)
const TIME_CONFIG = {
  delete_cycle: 10000,
  press_button_delay: 2000,
};

const MAX_RETRIES = 1000;

let imageCount = 0;

let checkboxes;
let buttons = {
  deleteButton: null,
  confirmationButton: null,
};

let deleteTask = setInterval(async () => {
  let attemptCount = 1;

  do {
    checkboxes = document.querySelectorAll(ELEMENT_SELECTORS["checkboxClass"]);
    await new Promise((r) => setTimeout(r, 1000));
  } while (checkboxes.length <= 0 && attemptCount++ < MAX_RETRIES);

  if (checkboxes.length <= 0) {
    console.log("[INFO] No more images to delete.");
    clearInterval(deleteTask);
    console.log("[SUCCESS] Tool exited.");
    return;
  }

  attemptCount = 1;
  imageCount += checkboxes.length;

  checkboxes.forEach((checkbox) => {
    checkbox.click();
  });
  console.log("[INFO] Deleting", checkboxes.length, "images");

  setTimeout(() => {
    try {
      buttons.deleteButton = document.querySelector(
        ELEMENT_SELECTORS["languageAgnosticDeleteButton"]
      );
      buttons.deleteButton.click();
    } catch {}

    setTimeout(() => {
      //   buttons.confirmation_button = document.querySelector(
      //     ELEMENT_SELECTORS["confirmationButton"]
      //   );
      //   buttons.confirmation_button.click();

      buttons.deleteButton = document.querySelector(
        ELEMENT_SELECTORS["deleteButton"]
      );
      buttons.deleteButton.click();

      console.log(`[INFO] ${imageCount}/${maxImageCount} Deleted`);
      if (
        maxImageCount !== "ALL_PHOTOS" &&
        imageCount >= parseInt(maxImageCount)
      ) {
        console.log(`${imageCount} photos deleted as requested`);
        clearInterval(deleteTask);
        console.log("[SUCCESS] Tool exited.");
        return;
      }
    }, TIME_CONFIG["press_button_delay"]);
  }, TIME_CONFIG["press_button_delay"]);
}, TIME_CONFIG["delete_cycle"]);
