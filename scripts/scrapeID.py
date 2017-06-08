# script found on https://pythonadventures.wordpress.com/2016/08/19/get-the-imdb-top-250-list/

import requests
import re
 
# top250_url = "http://akas.imdb.com/chart/top"
top250_url = "http://www.imdb.com/chart/top?ref_=nv_mv_250_6"

 
def get_top250():
    r = requests.get(top250_url)
    html = r.text.split("\n")
    result = []
    for line in html:
        line = line.rstrip("\n")
        m = re.search(r'data-titleid="tt(\d+?)">', line)
        if m:
            _id = m.group(1)
            result.append(_id)
    #
    return result
