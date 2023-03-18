from django import template

register = template.Library()

@register.simple_tag
def get_rate(ar1,ar2 ):
    # print("*"+(str(ar1).zfill(2))+'-'+(str(ar2).zfill(2)))
    return "*"+(str(ar1).zfill(2))+'-'+(str(ar2).zfill(2))