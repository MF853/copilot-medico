import datetime
from .parser import HTMLParser


class Consulta:
    def __init__(self, html_content):
        self.id = id
        parser = HTMLParser(html_content)
        self._paciente:str = ""
        self._exame:str = parser.find_exame_fisico()
        self._data:datetime = datetime.now()
        self._anamnese:str = parser.find_anamnese()

    def get_exame(self):
        return self._exame
    
    def get_anamnese(self):
        return self._anamnese
    
    def get_data(self):
        return self._data
    
    def get_paciente(self):
        return self._paciente
    
    def get_id(self):
        return self.id
        
