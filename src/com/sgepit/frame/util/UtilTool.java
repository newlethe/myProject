// Decompiled by Jad v1.5.8e2. Copyright 2001 Pavel Kouznetsov.
// Jad home page: http://kpdus.tripod.com/jad.html
// Decompiler options: packimports(3) fieldsfirst ansi space 
// Source File Name:   UtilTool.java

package com.sgepit.frame.util;

import java.io.PrintStream;
import java.math.BigDecimal;

public class UtilTool
{

	public UtilTool()
	{
	}

	public static String DoNumberCurrencyToChineseCurrency(BigDecimal bigdMoneyNumber)
	{
		String straChineseUnit[] = {
			"·Ö", "½Ç", "Ô²", "Ê°", "°Û", "Çª", "Íò", "Ê°", "°Û", "Çª", 
			"ÒÚ", "Ê°", "°Û", "Çª"
		};
		String straChineseNumber[] = {
			"Áã", "Ò¼", "·¡", "Èþ", "ËÁ", "Îé", "Â½", "Æâ", "°Æ", "¾Á"
		};
		String strChineseCurrency = "";
		boolean bZero = true;
		int ChineseUnitIndex = 0;
		System.out.println("Calling Method DoNumberCurrencyToChineseCurrency");
		try
		{
			if (bigdMoneyNumber.intValue() == 0)
				return "ÁãÔ²Õû";
			double doubMoneyNumber = Math.round(bigdMoneyNumber.doubleValue() * 100D);
			boolean bNegative = doubMoneyNumber < 0.0D;
			for (doubMoneyNumber = Math.abs(doubMoneyNumber); doubMoneyNumber > 0.0D;)
			{
				if (ChineseUnitIndex == 2 && strChineseCurrency.length() == 0)
					strChineseCurrency = strChineseCurrency + "Õû";
				if (doubMoneyNumber % 10D > 0.0D)
				{
					strChineseCurrency = straChineseNumber[(int)doubMoneyNumber % 10] + straChineseUnit[ChineseUnitIndex] + strChineseCurrency;
					bZero = false;
				} else
				{
					if (ChineseUnitIndex == 2)
					{
						if (doubMoneyNumber > 0.0D)
						{
							strChineseCurrency = straChineseUnit[ChineseUnitIndex] + strChineseCurrency;
							bZero = true;
						}
					} else
					if ((ChineseUnitIndex == 6 || ChineseUnitIndex == 10) && doubMoneyNumber % 1000D > 0.0D)
						strChineseCurrency = straChineseUnit[ChineseUnitIndex] + strChineseCurrency;
					if (!bZero)
						strChineseCurrency = straChineseNumber[0] + strChineseCurrency;
					bZero = true;
				}
				doubMoneyNumber = Math.floor(doubMoneyNumber / 10D);
				ChineseUnitIndex++;
			}

			if (bNegative)
				strChineseCurrency = "¸º" + strChineseCurrency;
		}
		catch (Exception e)
		{
			System.out.println("Exception Message : " + e.getMessage());
			e.printStackTrace();
			return "";
		}
		return strChineseCurrency;
	}
}
