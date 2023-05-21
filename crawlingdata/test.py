import numpy as np 
from selenium import webdriver
from time import sleep
import random
from selenium.common.exceptions import NoSuchAttributeException,ElementNotInteractableException
from selenium.webdriver.common.by import By
import pandas as pd

driver= webdriver.Chrome('chromedriver.exe')

driver.get('https://haloshop.vn/game-ps5')
sleep(random.randint(5,10))

elems=driver.find_elements(By.CSS_SELECTOR,".name[href]")
title =[elem.text for elem in elems]
links=[elem.get_attribute('href') for elem in elems]

eprices=driver.find_elements(By.CSS_SELECTOR,'.price[price-normal]')
price=[eprice.text for eprice in eprices]
df1=pd.DataFrame(list(zip(title,links,price)),columns=['title','links','price'])
df1['index_']=np.arange(1,len(df1)+1)

print(df1.head(5))