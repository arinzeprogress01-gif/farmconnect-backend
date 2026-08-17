import farmConnectIdentity from "./farmconnect.identity.js";
import farmConnectAuthentication from "./farmconnect.authentication.js";
import farmConnectUsers from "./farmconnect.users.js";
import farmConnectVendors from "./farmconnect.vendors.js";
import farmConnectListings from "./farmconnect.listings.js";
import farmConnectReservations from "./farmconnect.reservations.js";
import farmConnectNotifications from "./farmconnect.notifications.js";
import farmConnectGeolocation from "./farmconnect.geolocation.js";
import farmConnectAnalytics from "./farmconnect.analytics.js";
import farmConnectAutomation from "./farmconnect.automation.js";
import farmConnectBusinessRules from "./farmconnect.businessRules.js";


const FARMCONNECT_MEMORY = `
==================================================
FARMCONNECT MINI FARM AI MEMORY BANK
==================================================

${farmConnectIdentity}

--------------------------------------------------
${farmConnectAuthentication}

--------------------------------------------------
${farmConnectUsers}

--------------------------------------------------
${farmConnectVendors}

--------------------------------------------------
${farmConnectListings}

--------------------------------------------------
${farmConnectReservations}

--------------------------------------------------
${farmConnectNotifications}

--------------------------------------------------
${farmConnectGeolocation}

--------------------------------------------------
${farmConnectAnalytics}

--------------------------------------------------
${farmConnectAutomation}

--------------------------------------------------
${farmConnectBusinessRules}

==================================================
END OF CURRENT MEMORY
==================================================
`;


export default FARMCONNECT_MEMORY;