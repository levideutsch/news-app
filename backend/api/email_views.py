from django.core.mail import send_mail
from django.http import JsonResponse, HttpResponse
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework import status
from decouple import config  # Import the config function to access .env variables
import pdb
# from smtplib import SMTPException, gaierror  # Import exceptions for better error handling
from smtplib import SMTPException  # Import only SMTPException from smtplib
from socket import gaierror  # Import gaierror from the socket module

from backend.settings import EMAIL_HOST_USER, FRONTEND_URL



class SendEmailView(APIView):
    permission_classes = [AllowAny]  # Allow anyone to send an email for testing

    def post(self, request):
        receiver_email = request.data.get('receiver')
        message_text = request.data.get('text')
        frontend_url = FRONTEND_URL
        # pdb.set_trace()
        if not receiver_email or not message_text:
            return JsonResponse({'error': 'Receiver email and text are required.'}, status=400)
        try:
            # Define your HTML content directly in the view
            html_message = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <title>Test Email</title>
            </head>
            <body style="background-color:#394853; color:#333; font-family:Arial, sans-serif; padding:20px;">
                <div style="max-width:600px; margin:auto; background-color:#ffffff; padding:20px; border-radius:8px; box-shadow:0px 4px 8px rgba(0, 0, 0, 0.1);">
                    <h1 style="color:#333; text-align:center;">The Offendinator</h1>
                    <p>Thank you for signing up to the Offendinator. Click on  <a href="{frontend_url}" style="display:inline-block; text-decoration:none; background-color:#007BFF; color:white; padding:10px 20px; border-radius:5px; font-size:16px;">
                        this
                    </a> link to active your account</p>
                    <p style="font-size:16px;">{message_text}</p>
                    <p style="color:#666; font-size:14px;">Best regards,<br>Your Django App</p>
                </div>
            </body>
            </html>
            """
            # pdb.set_trace()
            # Send the email
            send_mail(
                subject='Test Email',
                message=message_text,  # Plain text fallback
                from_email=EMAIL_HOST_USER ,
                recipient_list=[receiver_email],
                html_message=html_message  # Send HTML content
            )
            
            return JsonResponse({'success': 'Email sent successfully!'}, status=200)
        # except Exception as e:
        #     return JsonResponse({'error': str(e)}, status=500)
        except SMTPException as smtp_err:
            # Catch SMTP related errors
            return JsonResponse({'error': f'SMTP error occurred: {str(smtp_err)}'}, status=500)
        except gaierror as addr_err:
            # Catch address-related errors (like hostname resolution)
            return JsonResponse({'error': f'Address-related error occurred: {str(addr_err)}'}, status=500)
        except Exception as e:
            # Catch all other exceptions
            return JsonResponse({'error': f'An error occurred: {str(e)}'}, status=500)
        
        
        
class EmailPreviewView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        # Sample content to preview
        message_text = "This is a preview of your email content."
        frontend_url = config('FRONTEND_URL', default='http://localhost:3000')

        # The HTML template or inline HTML for the email
        html_content = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <title>Test Email</title>
            </head>
            <body style="background-color:#394853; color:#333; font-family:Arial, sans-serif; padding:20px;">
                <div style="max-width:600px; margin:auto; background-color:#ffffff; padding:20px; border-radius:8px; box-shadow:0px 4px 8px rgba(0, 0, 0, 0.1);">
                    <h1 style="color:#333; text-align:center;">The Offendinator</h1>
                    <p>Thank you for signing up to the Offendinator. Click on  <a href="{frontend_url}" style="display:inline-block; text-decoration:none; background-color:#007BFF; color:white; padding:10px 20px; border-radius:5px; font-size:16px;">
                        this
                    </a> link to active your account</p>
                    <p style="font-size:16px;">{message_text}</p>
                    <p style="color:#666; font-size:14px;">Best regards,<br>Your Django App</p>
                </div>
            </body>
            </html>
            """

        # Render the HTML directly in the browser
        return HttpResponse(html_content)

