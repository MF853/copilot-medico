from bs4 import BeautifulSoup

class HTMLParser:
    def __init__(self, html_content):
        self.soup = BeautifulSoup(html_content, 'html.parser')
    
    def find_anamnese(self):
        anamnese_div = self.soup.find('div', class_='note-editable card-block')
        return anamnese_div.get_text(separator='\n', strip=True) if anamnese_div else ""
    
    def find_exame_fisico(self):
        exame_fisico_div_total = self.soup.find('div', attrs={'class': 'card-box m-b-5'})
        detalhes_div = exame_fisico_div_total.find('div', class_='note-editable card-block')
        return detalhes_div.get_text(separator='\n', strip=True) if detalhes_div else ""
    
