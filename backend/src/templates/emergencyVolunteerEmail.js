export const emergencyVolunteerEmail = ({ name, district, safeZoneLat, safeZoneLng }) => {
    const hasSafeZone =
        safeZoneLat !== null &&
        safeZoneLng !== null &&
        safeZoneLat !== undefined &&
        safeZoneLng !== undefined &&
        Number.isFinite(Number(safeZoneLat)) &&
        Number.isFinite(Number(safeZoneLng));

    const googleMapsUrl = hasSafeZone
        ? `https://www.google.com/maps/dir/?api=1` +
          `&origin=Current+Location` +
          `&destination=${encodeURIComponent(`${safeZoneLat},${safeZoneLng}`)}` +
          `&travelmode=driving`
        : null;

    return `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    />

    <title>Sindhu Drishti Emergency Alert</title>
</head>

<body
    style="
        margin:0;
        padding:0;
        background:#f3f4f6;
        font-family:Arial,Helvetica,sans-serif;
        color:#111827;
    "
>

<table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="background:#f3f4f6;"
>
    <tr>
        <td align="center" style="padding:30px 15px;">

            <!-- MAIN CARD -->

            <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="
                    max-width:620px;
                    background:#ffffff;
                    border-radius:18px;
                    overflow:hidden;
                    box-shadow:0 8px 30px rgba(0,0,0,0.08);
                "
            >

                <!-- HEADER -->

                <tr>
                    <td
                        style="
                            background:#991b1b;
                            padding:32px 28px;
                            color:#ffffff;
                        "
                    >

                        <div
                            style="
                                font-size:13px;
                                font-weight:700;
                                letter-spacing:1.5px;
                                opacity:0.9;
                            "
                        >
                            SINDHU DRISHTI
                        </div>

                        <h1
                            style="
                                margin:12px 0 8px;
                                font-size:28px;
                                line-height:1.25;
                            "
                        >
                            🚨 Emergency Volunteer Alert
                        </h1>

                        <p
                            style="
                                margin:0;
                                font-size:15px;
                                line-height:1.6;
                                color:#fee2e2;
                            "
                        >
                            Immediate attention may be required in your area.
                        </p>

                    </td>
                </tr>


                <!-- BODY -->

                <tr>
                    <td style="padding:32px 28px;">

                        <!-- GREETING -->

                        <p
                            style="
                                margin:0 0 16px;
                                font-size:16px;
                                color:#111827;
                            "
                        >
                            Hello
                            <strong>${escapeHtml(name)}</strong>,
                        </p>


                        <!-- DESCRIPTION -->

                        <p
                            style="
                                margin:0;
                                font-size:15px;
                                line-height:1.8;
                                color:#4b5563;
                            "
                        >
                            Our emergency response system has identified
                            your area within a
                            <strong style="color:#b91c1c;">
                                Red Zone
                            </strong>.
                            Volunteer support may be required in your
                            district.
                        </p>


                        <!-- CURRENT EMERGENCY AREA -->

                        <table
                            width="100%"
                            cellpadding="0"
                            cellspacing="0"
                            border="0"
                            style="margin-top:25px;"
                        >
                            <tr>
                                <td
                                    style="
                                        background:#fef2f2;
                                        border:1px solid #fecaca;
                                        border-radius:12px;
                                        padding:20px;
                                    "
                                >

                                    <div
                                        style="
                                            font-size:12px;
                                            font-weight:700;
                                            letter-spacing:0.8px;
                                            text-transform:uppercase;
                                            color:#991b1b;
                                        "
                                    >
                                        Current Emergency Area
                                    </div>

                                    <div
                                        style="
                                            margin-top:8px;
                                            font-size:21px;
                                            font-weight:700;
                                            color:#111827;
                                        "
                                    >
                                        ${escapeHtml(district)}
                                    </div>

                                </td>
                            </tr>
                        </table>


                        <!-- SAFE ZONE -->

                        <table
                            width="100%"
                            cellpadding="0"
                            cellspacing="0"
                            border="0"
                            style="margin-top:28px;"
                        >
                            <tr>
                                <td
                                    align="center"
                                    style="
                                        background:#f0fdf4;
                                        border:1px solid #bbf7d0;
                                        border-radius:14px;
                                        padding:25px 20px;
                                    "
                                >

                                    <div
                                        style="
                                            font-size:14px;
                                            font-weight:700;
                                            color:#166534;
                                            margin-bottom:10px;
                                        "
                                    >
                                        🛡️ DESIGNATED SAFE ZONE
                                    </div>

                                    ${
                                        hasSafeZone
                                            ? `
                                                <p
                                                    style="
                                                        margin:0 0 20px;
                                                        font-size:14px;
                                                        line-height:1.6;
                                                        color:#4b5563;
                                                    "
                                                >
                                                    A designated safe zone has
                                                    been identified for you.
                                                    Use the route below when
                                                    instructed to move to a
                                                    safer location.
                                                </p>

                                                <a
                                                    href="${googleMapsUrl}"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style="
                                                        display:inline-block;
                                                        background:#166534;
                                                        color:#ffffff;
                                                        text-decoration:none;
                                                        font-size:16px;
                                                        font-weight:700;
                                                        padding:15px 25px;
                                                        border-radius:9px;
                                                    "
                                                >
                                                    📍 Open Route to Safe Zone
                                                </a>

                                                <p
                                                    style="
                                                        margin:14px 0 0;
                                                        font-size:11px;
                                                        line-height:1.5;
                                                        color:#6b7280;
                                                    "
                                                >
                                                    Google Maps will open a
                                                    driving route from your
                                                    current location to the
                                                    designated safe zone.
                                                </p>
                                            `
                                            : `
                                                <p
                                                    style="
                                                        margin:0;
                                                        font-size:14px;
                                                        line-height:1.6;
                                                        color:#92400e;
                                                    "
                                                >
                                                    ⚠️ A designated safe zone
                                                    could not be identified
                                                    automatically at this time.
                                                    Please follow instructions
                                                    from the district response
                                                    team.
                                                </p>
                                            `
                                    }

                                </td>
                            </tr>
                        </table>


                        <!-- SAFETY INSTRUCTIONS -->

                        <div
                            style="
                                margin-top:28px;
                                padding-top:24px;
                                border-top:1px solid #e5e7eb;
                            "
                        >

                            <h3
                                style="
                                    margin:0 0 14px;
                                    font-size:17px;
                                    color:#111827;
                                "
                            >
                                ⚠️ Important Safety Instructions
                            </h3>

                            <ul
                                style="
                                    margin:0;
                                    padding-left:20px;
                                    color:#4b5563;
                                    font-size:14px;
                                    line-height:1.8;
                                "
                            >

                                <li>
                                    Do not enter or remain in an unsafe
                                    area if authorities have issued
                                    movement restrictions.
                                </li>

                                <li>
                                    Follow instructions from the district
                                    response team.
                                </li>

                                <li>
                                    Use designated safe zones when
                                    evacuation is required.
                                </li>

                                <li>
                                    Keep your phone charged and remain
                                    reachable.
                                </li>

                            </ul>

                        </div>


                        <!-- IMPORTANT NOTICE -->

                        <table
                            width="100%"
                            cellpadding="0"
                            cellspacing="0"
                            border="0"
                            style="margin-top:25px;"
                        >
                            <tr>
                                <td
                                    style="
                                        background:#fffbeb;
                                        border:1px solid #fde68a;
                                        border-radius:10px;
                                        padding:16px;
                                    "
                                >

                                    <p
                                        style="
                                            margin:0;
                                            font-size:13px;
                                            line-height:1.6;
                                            color:#92400e;
                                        "
                                    >
                                        <strong>Important:</strong>
                                        This alert is generated by the
                                        Sindhu Drishti emergency response
                                        system. Always follow official
                                        instructions from local authorities.
                                    </p>

                                </td>
                            </tr>
                        </table>


                        <!-- FOOTER -->

                        <div
                            style="
                                margin-top:28px;
                                padding-top:20px;
                                border-top:1px solid #e5e7eb;
                                text-align:center;
                            "
                        >

                            <p
                                style="
                                    margin:0;
                                    font-size:13px;
                                    color:#6b7280;
                                "
                            >
                                <strong>Sindhu Drishti</strong>
                            </p>

                            <p
                                style="
                                    margin:6px 0 0;
                                    font-size:11px;
                                    color:#9ca3af;
                                "
                            >
                                Intelligent Disaster Response Platform
                            </p>

                        </div>

                    </td>
                </tr>

            </table>

        </td>
    </tr>
</table>

</body>
</html>
`;
};

const escapeHtml = (value) => {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
};
