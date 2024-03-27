#Logistic regression - the six steps
#https://www.youtube.com/watch?v=qkivJzjyHoA

library(lmtest)
library(MASS)

mydata1=read.csv("scales.csv",header = TRUE,na.strings = "")
names(mydata1)

mydata1$Satisfaction.with.life=as.ordered(mydata1$Satisfaction.with.life)

mydata1$Energetic=as.ordered(mydata1$Energetic)
mydata1$Calm=as.ordered(mydata1$Calm)
mydata1$Angry=as.ordered(mydata1$Angry)
mydata1$Relaxed=as.ordered(mydata1$Relaxed)
mydata1$Scared=as.ordered(mydata1$Scared)
mydata1$Irritated=as.ordered(mydata1$Irritated)
mydata1$Exhausted=as.ordered(mydata1$Exhausted)
mydata1$Panicky=as.ordered(mydata1$Panicky)
mydata1$Bored=as.ordered(mydata1$Bored)
mydata1$Inspired=as.ordered(mydata1$Inspired)
mydata1$Lonely=as.ordered(mydata1$Lonely)
mydata1$Happy=as.ordered(mydata1$Happy)
mydata1$Jealous=as.ordered(mydata1$Jealous)
mydata1$Content=as.ordered(mydata1$Content)
mydata1$Sad=as.ordered(mydata1$Sad)
mydata1$Loved=as.ordered(mydata1$Loved)
mydata1$Proud=as.ordered(mydata1$Proud)
mydata1$Depressed=as.ordered(mydata1$Depressed)
mydata1$Caring=as.ordered(mydata1$Caring)
mydata1$Embarrassed=as.ordered(mydata1$Embarrassed)
mydata1$Worried=as.ordered(mydata1$Worried)
mydata1$Excited=as.ordered(mydata1$Excited)
mydata1$Nervous=as.ordered(mydata1$Nervous)
mydata1$Satisfaction.with.personal.relationships=as.ordered(mydata1$Satisfaction.with.personal.relationships)
mydata1$Purpose=as.ordered(mydata1$Purpose)

str(mydata1)

# 2. Partition data
ind <- sample(2, nrow(mydata1), replace = TRUE, prob = c(0.6,0.4))

train <- mydata1[ind==1,]
test <- mydata1[ind==2,]

# 3. Ordinal Logitic Regression or Proportional Odds Logistic Regression
reg=polr(Satisfaction.with.life~BILLS+FOOD...DRINKS+GROCERIES+MEDICAL+MOVIES+RENT+ROOM.COMMON.EXPENSES+SHOPPING+TRAVEL,train,Hess=TRUE)

# 4. p-Value Calculation
summary(reg)
ctable=coef(summary(reg))
p=pnorm(abs(ctable[,"t value"]),lower.tail = FALSE)*2
ctable=cbind(ctable,"p value" = p)
ctable

# 5. Prediction
pred <- predict(reg, train)
print(pred, digits = 3)


# 6. Confusion Matrix & Error for Training data
(tab <- table(pred,train$Satisfaction.with.life))
1-sum(diag(tab))/sum(tab)

# 7. Confusion Matrix & Error for Test data
pred1 <- predict(reg,test)
(tab1 <- table(pred1, test$Satisfaction.with.life))
1-sum(diag(tab1))/sum(tab1)


#reg=lm(Satisfaction.with.life~Energetic+Jealous+Calm+Content+Angry
#       +Sad+Relaxed+Loved+Scared+Proud+Irritated+Depressed+Exhausted+
 #        Caring+Panicky+Embarrassed++Bored+Worried+Inspired+Excited+Lonely+Nervous+Happy,data = mydata1)

#summary(reg)
#lrtest(reg)

