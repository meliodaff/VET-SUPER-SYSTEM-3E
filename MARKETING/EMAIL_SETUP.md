# Email Configuration Guide for XAMPP

To enable email sending in XAMPP, you need to configure the `sendmail.ini` file. Follow these steps:

## Option 1: Configure XAMPP Sendmail (Recommended for Development)

### Step 1: Configure php.ini

1. Open `C:\xampp\php\php.ini` in a text editor
2. Find the `[mail function]` section
3. Update it to:
```ini
[mail function]
SMTP=localhost
smtp_port=25
sendmail_from = noreply@furevercare.com
sendmail_path = "\"C:\xampp\sendmail\sendmail.exe\" -t"
```

### Step 2: Configure sendmail.ini

1. Open `C:\xampp\sendmail\sendmail.ini` in a text editor
2. Find the `[sendmail]` section
3. Update it with your Gmail credentials:

```ini
[sendmail]
smtp_server=smtp.gmail.com
smtp_port=587
smtp_ssl=tls
error_logfile=error.log
auth_username=your-email@gmail.com
auth_password=your-app-password
```

### Step 3: Get Gmail App Password

**Important:** You cannot use your regular Gmail password. You need to create an App Password:

1. Go to your Google Account settings: https://myaccount.google.com/
2. Click on **Security** in the left sidebar
3. Under "2-Step Verification", make sure it's enabled
4. Scroll down to "App passwords"
5. Click "App passwords"
6. Select "Mail" and "Other (Custom name)"
7. Enter "XAMPP" as the name
8. Click "Generate"
9. Copy the 16-character password (use this in sendmail.ini)

### Step 4: Restart Apache

1. Open XAMPP Control Panel
2. Stop Apache
3. Start Apache again

### Step 5: Test Email

Try registering a new account. The OTP email should be sent to the email address you register with.

---

## Option 2: Use PHPMailer (Alternative)

If you prefer using PHPMailer library:

1. Download PHPMailer from: https://github.com/PHPMailer/PHPMailer
2. Extract it to `C:\xampp\htdocs\realest\VET\VET\PHPMailer\`
3. Update the `sendOTPEmail()` function in `register.php` to use PHPMailer

---

## Troubleshooting

### Email not sending?

1. **Check if Apache is running** in XAMPP Control Panel
2. **Verify sendmail.ini** has correct Gmail credentials
3. **Check error.log** in `C:\xampp\sendmail\error.log`
4. **Ensure 2-Step Verification is enabled** on your Gmail account
5. **Use App Password**, not your regular Gmail password

### Still having issues?

- Make sure your firewall isn't blocking port 587
- Try using port 465 with `smtp_ssl=ssl` instead of 587 with `smtp_ssl=tls`
- Check that your Gmail account allows "Less secure app access" (if not using App Password)

---

## Security Note

For production, consider:
- Using a dedicated email service (SendGrid, Mailgun, etc.)
- Storing email credentials securely (environment variables)
- Using PHPMailer with proper error handling

