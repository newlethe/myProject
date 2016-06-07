/** 
 * Title:       脚本应用: 
 * Description:  脚本操作
 * Company:      sgepit
 */
package com.sgepit.helps.scriptService;

import groovy.lang.Binding;
import groovy.lang.GroovyShell;

import java.io.File;
import java.util.Iterator;
import java.util.Map;

import org.codehaus.groovy.control.CompilerConfiguration;

import com.sgepit.helps.util.StringUtil;

/**
 * 脚本操作类
 * @author lizp
 * @Date 2010-8-11
 */
public class ScriptUtil {
	/**
	 * 动态执行脚本
	 * @param script
	 * @return
	 */
	public static Object eval(String script)  {
		return exeScript(script,null);
	}
	/**
	 * 字符串脚本执行
	 * 脚本执行通过groovy实现，字符编码统一为UTF-8
	 * @param script 脚本内容
	 * @param variables 变量集合
	 * @return
	 */
	public static Object exeScript(String script, Map variables)  {
		Object obj = null ;
		try {
			Binding binding = new Binding() ;
			if(variables!=null) {
				Iterator it = variables.keySet().iterator();
				while(it.hasNext()) {
					Object key = it.next() ;
					Object value = variables.get(key) ;
					binding.setVariable(StringUtil.objectToString(key), value) ;
				}
			}
			GroovyShell shell = new GroovyShell(binding) ;
			shell.setProperty("encoding", "utf-8") ;
			obj = shell.evaluate(script) ;
		} catch (RuntimeException e) {
			throw e ;
		}
		return obj ;
	}
	
	/**
	 * 执行文件脚本
	 * 脚本执行通过groovy实现，字符编码统一为UTF-8
	 * @param file 文件对象
	 * @return 
	 */
	public static Object exeScript(File file)  {
		Object obj = null ;
		try {
			CompilerConfiguration conf = new CompilerConfiguration() ; 
			conf.setSourceEncoding("utf-8") ;
			GroovyShell shell = new GroovyShell(conf) ;
		} catch (RuntimeException e) {
			throw e ;
		}
		return obj ;
	}
	
	public static void main(String[] args){
		String test = "[['12','12'],['212','2121']]" ;
		Object o = eval(test);
		System.out.println(o.getClass());
	}
}
