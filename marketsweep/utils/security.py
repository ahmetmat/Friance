import base64
import os
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC

class SecurityUtils:
    """Utility class for encryption and security functions"""
    
    @staticmethod
    def generate_key(password, salt=None):
        """
        Generate a key from password for Fernet encryption
        
        Args:
            password (str): Password to use for key generation
            salt (bytes, optional): Salt for key derivation. If None, a random salt is generated.
            
        Returns:
            tuple: (key, salt) - The derived key and the salt used
        """
        if salt is None:
            salt = os.urandom(16)
        
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=salt,
            iterations=100000,
        )
        
        key = base64.urlsafe_b64encode(kdf.derive(password.encode()))
        return key, salt
    
    @staticmethod
    def encrypt_data(data, key):
        """
        Encrypt data using Fernet symmetric encryption
        
        Args:
            data (str): Data to encrypt
            key (bytes): Encryption key (from generate_key)
            
        Returns:
            bytes: Encrypted data
        """
        f = Fernet(key)
        encrypted_data = f.encrypt(data.encode())
        return encrypted_data
    
    @staticmethod
    def decrypt_data(encrypted_data, key):
        """
        Decrypt data using Fernet symmetric encryption
        
        Args:
            encrypted_data (bytes): Data to decrypt
            key (bytes): Encryption key (from generate_key)
            
        Returns:
            str: Decrypted data
        """
        f = Fernet(key)
        decrypted_data = f.decrypt(encrypted_data)
        return decrypted_data.decode()
    
    @staticmethod
    def encrypt_api_key(api_key, master_password):
        """
        Encrypt an API key with a master password
        
        Args:
            api_key (str): API key to encrypt
            master_password (str): Master password for encryption
            
        Returns:
            dict: Dictionary with encrypted data and salt
        """
        key, salt = SecurityUtils.generate_key(master_password)
        encrypted_api_key = SecurityUtils.encrypt_data(api_key, key)
        
        return {
            'encrypted_data': base64.b64encode(encrypted_api_key).decode(),
            'salt': base64.b64encode(salt).decode()
        }
    
    @staticmethod
    def decrypt_api_key(encrypted_data, salt, master_password):
        """
        Decrypt an API key with the master password
        
        Args:
            encrypted_data (str): Base64 encoded encrypted data
            salt (str): Base64 encoded salt
            master_password (str): Master password for decryption
            
        Returns:
            str: Decrypted API key
        """
        encrypted_bytes = base64.b64decode(encrypted_data)
        salt_bytes = base64.b64decode(salt)
        
        key, _ = SecurityUtils.generate_key(master_password, salt_bytes)
        
        return SecurityUtils.decrypt_data(encrypted_bytes, key)
    
    @staticmethod
    def mask_api_key(api_key, visible_chars=4):
        """
        Mask an API key for display purposes
        
        Args:
            api_key (str): API key to mask
            visible_chars (int): Number of characters to show at start and end
            
        Returns:
            str: Masked API key
        """
        if not api_key or len(api_key) <= visible_chars * 2:
            return "****"
        
        return f"{api_key[:visible_chars]}...{api_key[-visible_chars:]}"