import os
import magic
from django.core.exceptions import ValidationError
from django.conf import settings

# File upload security settings
ALLOWED_FILE_TYPES = {
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    'application/pdf': ['.pdf'],
    'image/gif': ['.gif']
}

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

def validate_file_type(file):
    """Validate file type using python-magic for security"""
    if not file:
        return
    
    # Check file size
    if file.size > MAX_FILE_SIZE:
        raise ValidationError(f'File size cannot exceed {MAX_FILE_SIZE // (1024*1024)}MB')
    
    # Get file extension
    file_extension = os.path.splitext(file.name)[1].lower()
    
    # Read file content to detect actual file type
    file.seek(0)
    file_content = file.read(1024)  # Read first 1KB
    file.seek(0)  # Reset file pointer
    
    try:
        detected_type = magic.from_buffer(file_content, mime=True)
    except:
        raise ValidationError('Unable to determine file type')
    
    # Validate against allowed types
    if detected_type not in ALLOWED_FILE_TYPES:
        raise ValidationError(f'File type {detected_type} not allowed')
    
    # Validate file extension matches detected type
    allowed_extensions = ALLOWED_FILE_TYPES[detected_type]
    if file_extension not in allowed_extensions:
        raise ValidationError(f'File extension {file_extension} does not match file type {detected_type}')

def validate_image_file(file):
    """Specific validation for image files"""
    validate_file_type(file)
    
    # Additional image-specific validations
    if file.size < 1024:  # Minimum 1KB
        raise ValidationError('Image file too small')

def validate_document_file(file):
    """Specific validation for document files"""
    validate_file_type(file)
    
    # Additional document-specific validations
    if file.size < 100:  # Minimum 100 bytes
        raise ValidationError('Document file too small')