from selenium import webdriver
import datetime
import os,time

if __name__=='__main__':
    url_file_driver=os.path.join('etc','chromedriver.exe')
    driver=webdriver.Chrome(executable_path=url_file_driver)
    driver.get('https://divineshop.vn/user/orders')
    time.sleep(4)
    driver.close()