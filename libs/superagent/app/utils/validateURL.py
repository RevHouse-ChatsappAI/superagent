import re

def validate_url(url):
    regex = r'^https?://(?:www\.)?[\w\.-]+\.\w+'
    if re.match(regex, url):
        return True
    else:
        return False