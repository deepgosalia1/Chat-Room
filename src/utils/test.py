removal1="pr"
removal2="rp"
def func1(S):
    if T!=0:
        #Enter/Take value for string S
        #Take X and Y
        for x in removal1:
            S=S.replace(x,'')
            S=''.join(S.split())
            count +=1
            X=X*count
        for x in removal2:
            S=S.replace(x,'')
            S=''.join(S.split())
            count +=1
            Y=Y*count
        T -= 1
        print(count)
func1('ppprrr')