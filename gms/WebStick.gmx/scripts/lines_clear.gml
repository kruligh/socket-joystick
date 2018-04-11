
    if (!callback_script("lines_clear",0)) {
        exit;
    }
    
    //Note: 
    // - The above needs to be called before anything else in the script.
    // - The script should always exit if 'callback_script()' returns false.
    // - Remember to ensure the number of arguments is always set correctly.
    
    //Default message
    var version = "v0.1"
    var defaultMessage = "               _     _____ _   _      _    
              | |   / ____| | (_)    | |   
 __      _____| |__| (___ | |_ _  ___| | __
 \ \ /\ / / _ \ '_ \\___ \| __| |/ __| |/ /
  \ V  V /  __/ |_) |___) | |_| | (__|   < 
   \_/\_/ \___|_.__/_____/ \__|_|\___|_|\_\ " + version + "#"

    obj_control.display = defaultMessage;
    return true;
