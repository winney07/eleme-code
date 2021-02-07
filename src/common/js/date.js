export function formatDate (time) {
			// 时间格式
			var fmt = 'yyyy-MM-dd hh:mm'
			// 转为Date对象
			var date = new Date(time)

			// 正则匹配，并替换
			if (/(y+)/.test(fmt)) { // 年
				// RegExp.$1获取到正则对应的第一个元素yyyy
				var year = date.getFullYear() + ''
				fmt = fmt.replace(RegExp.$1, year)
			}
			if (/(M+)/.test(fmt)) { // 月
				var month = date.getMonth() + 1
				if (month < 10) {
					month = '0' + month
				}
				fmt = fmt.replace(RegExp.$1, month)
			}
			if (/(d+)/.test(fmt)) { // 日
				var mydate = date.getDate() + ''
				if (mydate < 10) {
					mydate = '0' + mydate
				}
				fmt = fmt.replace(RegExp.$1, mydate)
			}
			if (/(h+)/.test(fmt)) { // 时
				var hours = date.getHours() + ''
				if (hours < 10) {
					hours = '0' + hours
				}
				fmt = fmt.replace(RegExp.$1, hours)
			}
			if (/(m+)/.test(fmt)) { // 分
				var minu = date.getMinutes() + ''
				if (minu < 10) {
					minu = '0' + minu
				}
				fmt = fmt.replace(RegExp.$1, minu)
			}
			return fmt 
		}
