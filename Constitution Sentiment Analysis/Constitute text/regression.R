#Logistic regression - the six steps

mydata1=read.csv("beta.csv",header = TRUE,na.strings = "")
names(mydata1)
str(mydata1)
summary(mydata1)

mydata=na.omit(mydata1)

attach(mydata)
cor(sentiment.score,ef_score)

anova1=aov(sentiment.score~regime.type+basis.of.executive.legitimacy+constitutional.form,data=mydata)
summary(anova1)

#reg=lm(sentiment.score~basis.of.executive.legitimacy+constitutional.form+continent+head.of.state+regime.type ,data = mydata)

reg=glm(sentiment.score~regime.type+constitutional.form+basis.of.executive.legitimacy,data = mydata,family = gaussian("identity"))
summary(reg)
anova(reg)

#Step1 : Overall validity of the modelLogLikelyhood test
library(lmtest)
lrtest(reg)
##########################OUTPUT##########################
#Interpretation:

#Model2 - null model - df = 1 i.e, run only with the B0 factor(only the intercepts exist) which gives a loglikelyhood of -20.794
#Model1 - by adding the factors to the intercept the loglikelyhood is improved by ~9units which is good
#difference(gain) multiplied by 2 is the chisq value (18.117) is overwhemingly significant
#this means that all betas are zero is rejected and we conclude that at least one Beta is nonzero 
#therefore it is ok to proceed with the regression model

#Step2: McFadden R square and interpretation
library(pscl)
pR2(reg)
##########################OUTPUT##########################
# llh     llhNull          G2    McFadden        r2ML        r2CU 
# -11.7357033 -20.7944154  18.1174243   0.4356320   0.4533323   0.6044431 

#univerally, the minimum Rsquare is 10%, below which the model's verasity can be questioned
#McFadden Rsq - interpretaion - null model produces uncertainity ... 43.56% of the uncertainity produced by the null model (intercept only model) 
#is explained by the full model. thus the goodness of the fit is robust



